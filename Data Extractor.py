"""
Extract CV (Check Voucher) summary data from a text-based, borderless PDF
into an itemized Excel file.

Handles:
  - Tables with NO visible gridlines (column position based, not border based)
  - DATE TRANS headers that get separated from their table across a page break
    (the script carries the "current date" forward continuously through the
    whole document, page after page, until a new DATE TRANS line appears)
  - Subtotal rows, blank rows, and wrapped header rows (auto-skipped)

Output columns: Date Trans | CV Number | Name of Payee | CV Gross Amount | CV Net Amount
"""
    
import pdfplumber
import pandas as pd
import re

PDF_PATH = "ocr_output.pdf"          # <-- change to your actual PDF filename
OUTPUT_PATH = "cv_summary_extracted.xlsx"

DATE_PATTERN = re.compile(r'\bDATE\s*TRANS\b\s*:?\s*(.+)', re.IGNORECASE)
CV_NUMBER_PATTERN = re.compile(r'^CV[\w\-]+$', re.IGNORECASE)


def get_lines(page):
    """Group words on a page into lines (by vertical position), each line
    being a list of word-dicts sorted left-to-right."""
    words = page.extract_words()
    lines = {}
    for w in words:
        top = round(w['top'])
        # merge words that are within 2px of an existing line bucket
        key = next((k for k in lines if abs(k - top) <= 2), top)
        lines.setdefault(key, []).append(w)
    return [sorted(ws, key=lambda w: w['x0']) for _, ws in sorted(lines.items())]


def detect_columns(line_words):
    """If this line looks like the table header row, return a dict of
    column-name -> x0 boundary. Otherwise return None."""
    texts = [w['text'].upper() for w in line_words]
    joined = " ".join(texts)
    if not ("NUMBER" in joined and "AMOUNT" in joined and "CHECK" in joined):
        return None

    cols = {}
    n = len(line_words)
    for i, w in enumerate(line_words):
        t = w['text'].upper()
        nxt = line_words[i + 1]['text'].upper() if i + 1 < n else ""
        if t == "CV" and nxt.startswith("NUMBER"):
            cols['cv_number'] = w['x0']
        elif t == "NAME" and nxt == "OF":
            cols['payee'] = w['x0']
        elif t == "PROJECT":
            cols.setdefault('project', w['x0'])
        elif t == "CV" and nxt.startswith("AMOUNT"):
            cols['cv_amount'] = w['x0']
        elif t == "TOTAL" and nxt.startswith("CHECK"):
            cols['total_check'] = w['x0']
        elif t == "REMARKS":
            cols['remarks'] = w['x0']

    required = ('cv_number', 'payee', 'cv_amount', 'total_check')
    if all(k in cols for k in required):
        return cols
    return None


def bucket_row(line_words, columns):
    """Assign each word on a data row to the nearest column bucket (based
    on x0 boundaries captured from the header row), then join per bucket."""
    boundaries = sorted(columns.items(), key=lambda kv: kv[1])  # [(name, x0), ...]
    buckets = {name: [] for name, _ in boundaries}

    for w in line_words:
        # pick the last boundary whose x0 <= word's x0
        col_name = boundaries[0][0]
        for name, x0 in boundaries:
            if w['x0'] >= x0 - 2:  # small tolerance
                col_name = name
            else:
                break
        buckets[col_name].append(w['text'])

    return {name: " ".join(words) for name, words in buckets.items()}


def extract(pdf_path):
    records = []
    current_date = None
    current_columns = None

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for line_words in get_lines(page):
                line_text = " ".join(w['text'] for w in line_words)

                # 1. Date header? (persists across pages/tables)
                date_match = DATE_PATTERN.search(line_text)
                if date_match:
                    current_date = date_match.group(1).strip(" :")
                    continue

                # 2. New table header row? (re-establish column boundaries)
                cols = detect_columns(line_words)
                if cols:
                    current_columns = cols
                    continue

                # 3. Data row? (only if we know the column layout)
                if not current_columns:
                    continue
                row = bucket_row(line_words, current_columns)
                cv_no = row.get('cv_number', '').strip()
                if not CV_NUMBER_PATTERN.match(cv_no.replace(" ", "")):
                    continue  # skip subtotal / blank / stray lines

                records.append({
                    "Date Trans": current_date,
                    "CV Number": cv_no.replace(" ", ""),
                    "Name of Payee": row.get('payee', '').strip(),
                    "CV Gross Amount": row.get('cv_amount', '').strip(),
                    "CV Net Amount": row.get('total_check', '').strip(),
                })

    return pd.DataFrame(records)


if __name__ == "__main__":
    df = extract(PDF_PATH)
    df.to_excel(OUTPUT_PATH, index=False)
    print(f"Extracted {len(df)} rows -> {OUTPUT_PATH}")
    print(df.to_string(index=False))
