import {randomBytes,scryptSync} from 'node:crypto';
// Run interactively: password input is not echoed or accepted on the command line.
if(!process.stdin.isTTY)throw Error('Run npm run analytics:password in an interactive local terminal.');
process.stdout.write('New analytics password (16+ characters): ');
process.stdin.setRawMode(true);process.stdin.resume();let password='';
process.stdin.on('data',chunk=>{
  for(const char of chunk.toString()) {
    if(char==='\u0003'){process.stdin.setRawMode(false);process.exit(1);}
    if(char==='\r'||char==='\n') {
      process.stdin.setRawMode(false);process.stdin.pause();
      if(password.length<16){console.error('\nUse at least 16 characters.');process.exit(1);}
      const salt=randomBytes(16).toString('hex'),hash=scryptSync(password,salt,64).toString('hex');password='';
      console.log('\nANALYTICS_ADMIN_PASSWORD_HASH='+salt+':'+hash);
      console.log('ANALYTICS_SESSION_SECRET='+randomBytes(32).toString('hex'));
      console.log('Copy these into server-side Netlify environment settings only. Do not commit them.');process.exit(0);
    }
    if(char==='\u007f'||char==='\b')password=password.slice(0,-1);else if(char>=' '&&password.length<256)password+=char;
  }
});
