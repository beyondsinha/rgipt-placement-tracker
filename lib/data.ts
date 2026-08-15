import { Offer, Branch } from './types';
export const branches:Branch[]=[
 {code:'CSE',name:'Computer Science & Engineering'},
 {code:'CSD',name:'Computer Science & Design'},
 {code:'IT',name:'Information Technology'},
 {code:'IDD',name:'Integrated Dual Degree'},
 {code:'MnC',name:'Mathematics & Computing'},
 {code:'ECE',name:'Electronics & Communication Engineering'},
 {code:'EV',name:'Electrical Vehicle'},
 {code:'PE',name:'Petroleum Engineering'},
 {code:'CHE',name:'Chemical Engineering'}
]
export const demoOffers:Offer[]=[
 {id:'1',session:'2026-27',notificationDate:'2026-08-11',company:'Deloitte',sector:'Consulting',offerType:'FTE',branches:['CSE','MnC','ECE','EE'],minCgpa:7.5,role:'Analyst / SDE',ctc:1200000,stipend:null,location:'Pan India',studentsSelected:5,notes:'Indicative demo data — replace with verified placement records.'},
 {id:'2',session:'2026-27',notificationDate:'2026-08-10',company:'ZS Associates',sector:'Analytics & Consulting',offerType:'PPO',branches:['CSE','MnC','ECE'],minCgpa:7,role:'Decision Analytics Associate',ctc:1456000,stipend:52000,location:'Bengaluru / Pune',studentsSelected:3},
 {id:'3',session:'2026-27',notificationDate:'2026-08-09',company:'Accenture',sector:'IT Services',offerType:'Intern + FTE',branches:['CSE','MnC','ECE','EE','ME','CHE','PE'],minCgpa:6.5,role:'Associate Software Engineer',ctc:700000,stipend:16000,location:'Bengaluru',studentsSelected:12},
 {id:'4',session:'2026-27',notificationDate:'2026-08-07',company:'Reliance Industries',sector:'Core / Energy',offerType:'FTE',branches:['CHE','PE','ME','EE'],minCgpa:6,role:'Graduate Engineer Trainee',ctc:950000,stipend:null,location:'Multiple',studentsSelected:7},
 {id:'5',session:'2026-27',notificationDate:'2026-08-05',company:'Microsoft',sector:'Technology',offerType:'Intern + FTE',branches:['CSE','MnC','ECE'],minCgpa:8,role:'Software Engineer Intern',ctc:3500000,stipend:125000,location:'Hyderabad',studentsSelected:2},
 {id:'6',session:'2026-27',notificationDate:'2026-08-02',company:'ONGC',sector:'PSU / Energy',offerType:'FTE',branches:['PE','ME','CHE','EE'],minCgpa:6.5,role:'AEE / Graduate Engineer',ctc:1300000,stipend:null,location:'India',studentsSelected:6},
 {id:'7',session:'2026-27',notificationDate:'2026-07-29',company:'Amazon',sector:'Technology',offerType:'Intern',branches:['CSE','MnC','ECE'],minCgpa:7.5,role:'SDE Intern',ctc:null,stipend:100000,location:'Bengaluru / Hyderabad',studentsSelected:2},
 {id:'8',session:'2026-27',notificationDate:'2026-07-25',company:'Tata Steel',sector:'Core Engineering',offerType:'FTE',branches:['ME','CHE','PE','EE','CE'],minCgpa:6,role:'Management Trainee',ctc:900000,stipend:null,location:'Jamshedpur / Odisha',studentsSelected:8},
 {id:'9',session:'2026-27',notificationDate:'2026-07-22',company:'EY',sector:'Consulting',offerType:'FTE',branches:['CSE','MnC','ECE','EE','ME','CHE'],minCgpa:6.5,role:'Technology Consultant',ctc:850000,stipend:null,location:'Gurugram / Bengaluru',studentsSelected:9},
 {id:'10',session:'2026-27',notificationDate:'2026-07-18',company:'Flipkart',sector:'Technology',offerType:'Intern + FTE',branches:['CSE','MnC'],minCgpa:8,role:'SDE Intern',ctc:2200000,stipend:100000,location:'Bengaluru',studentsSelected:1}
];
