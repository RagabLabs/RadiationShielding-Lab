import { writeFileSync } from 'node:fs';
import { validateData } from './data-checks';
const report={timestamp:new Date().toISOString(),...validateData()};
writeFileSync('reports/data-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!report.passed)process.exitCode=1;
