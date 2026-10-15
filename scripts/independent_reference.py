#!/usr/bin/env python3
"""Independent 60-digit Decimal reference calculation. No application import.
Source values transcribed from NIST's lead/water SRD126 rows at 1, 0.1 MeV
and XCOM lead partials at 1 MeV. The decimals are rounded source data, not
claims of experimental precision. Used only as numerical test fixtures.
"""
from decimal import Decimal as D, getcontext
import json, pathlib
getcontext().prec = 60
root = pathlib.Path(__file__).resolve().parents[1]
k=D('0.07102'); rho=D('11.35'); mu=k*rho
lead='https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html'
water='https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/water.html'
cases=[
 ('01','Mass coefficient','kappa(E)',k,'cm2/g',lead,'Pb, 1 MeV; exact SRD126 row'),
 ('02','Linear coefficient','mu=kappa*rho',mu,'1/cm',lead,'Pb, 1 MeV; rho=11.35 g/cm3'),
 ('03','Narrow-beam transmission','exp(-mu*x)',(-mu).exp(),'fraction',lead,'Pb, 1 MeV; x=1 cm'),
 ('04','Required thickness','-ln(T)/mu',-D('.01').ln()/mu,'cm',lead,'Pb, 1 MeV; target T=0.01'),
 ('05','Half-value layer','ln(2)/mu',D(2).ln()/mu,'cm',lead,'Pb, 1 MeV'),
 ('06','Tenth-value layer','ln(10)/mu',D(10).ln()/mu,'cm',lead,'Pb, 1 MeV'),
 ('07','Multilayer transmission','exp(-sum(mu_i*x_i))',(-mu-D('.07072')*10).exp(),'fraction',lead+' ; '+water,'Pb 1 cm + water 10 cm, 1 MeV'),
 ('08','Mean free path','1/mu',1/mu,'cm',lead,'Pb, 1 MeV'),
 ('09','Partial coefficient sum','coherent+incoherent+photoelectric+pair',D('.002991')+D('.04993')+D('.01810'),'cm2/g','https://physics.nist.gov/cgi-bin/Xcom/xcom3_1','Pb, 1 MeV; XCOM coherent=.002991, incoherent=.04993, PE=.01810; pair=0'),
 ('10','Spectrum photon ratio','sum(w*T)/sum(w)',((-D('.1707')*10).exp()+(-D('.07072')*10).exp())/2,'fraction',water,'Water 10 cm; 0.1 and 1 MeV; equal photon weights'),
]
output=[dict(id=i,name=n,formula=f,expected=float(v),referenceDecimal=str(v),unit=u,source=s,inputs=inp,tolerance=1e-12) for i,n,f,v,u,s,inp in cases]
root.joinpath('tests/fixtures').mkdir(exist_ok=True)
root.joinpath('tests/fixtures/reference.json').write_text(json.dumps(output,indent=2)+'\n')
print('Wrote 10 independent Decimal reference fixtures.')
