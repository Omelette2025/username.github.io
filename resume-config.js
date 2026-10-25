/* Single source of truth for recruitment resume labels, files and descriptions. */
(function(root){
 'use strict';
 const config={defaultId:'general',resumes:[
  {id:'general',name:'General Civil Engineer',path:'assets/resumes/Ruzzel_Dulay_General_Civil_Engineer_Resume.pdf',description:'A broad overview of structural modeling, estimation, construction cost control and practical engineering automation.'},
  {id:'structural',name:'Junior Structural Engineer',path:'assets/resumes/Ruzzel_Dulay_Junior_Structural_Engineer_Resume.pdf',description:'Emphasizes structural modeling, design-related experience, seismic research and calculation verification.'},
  {id:'graduate',name:'Graduate Engineer',path:'assets/resumes/Ruzzel_Dulay_Graduate_Engineer_Resume.pdf',description:'Emphasizes engineering foundations, project experience and development toward a graduate engineering role.'},
  {id:'cost',name:'Cost Engineer / Cost Control',path:'assets/resumes/Ruzzel_Dulay_Cost_Engineer_Cost_Control_Resume.pdf',description:'Focuses on construction cost control, budget-versus-actual reporting and commercial documentation.'},
  {id:'quantity',name:'Quantity Surveyor / Cost Estimator',path:'assets/resumes/Ruzzel_Dulay_Quantity_Surveyor_Cost_Estimator_Resume.pdf',description:'Focuses on measured quantities, estimating, itemized quotations and transparent cost documentation.'},
  {id:'automation',name:'Civil Engineering + Automation',path:'assets/resumes/Ruzzel_Dulay_Civil_Engineering_Automation_Resume.pdf',description:'Connects civil engineering experience with Python, Excel/VBA and engineering software development.'}
 ]};
 root.PortfolioResumes=config;if(typeof module==='object'&&module.exports)module.exports=config;
})(typeof window==='object'?window:globalThis);
