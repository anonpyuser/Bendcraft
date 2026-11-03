(function(root){
'use strict';
const factors={in:1,ft:12,yd:36,mm:1/25.4,cm:1/2.54,m:1000/25.4};
function number(raw){const s=String(raw).trim();const match=s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);let value;if(match){if(+match[3]===0)throw Error('A fraction denominator cannot be zero.');value=+(match[1]||0)+ +match[2]/+match[3]}else if(/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))value=Number(s);else throw Error('Use a decimal or fraction, such as 3 1/2.');if(!Number.isFinite(value))throw Error('Enter a finite number.');return value}
function scalar(raw){let s=String(raw).trim(),sign=s.startsWith('-')?-1:1;if(s.startsWith('-')||s.startsWith('+'))s=s.slice(1);return sign*number(s)}
function length(raw,defaultUnit='in'){
 if(!(defaultUnit in factors))throw Error('Unknown unit.');
 let s=String(raw).trim().toLowerCase().replace(/[′’]/g,"'").replace(/[″“”]/g,'"').replace(/feet|foot/g,'ft').replace(/inches|inch/g,'in').replace(/'/g,'ft ').replace(/"/g,'in '),sign=1;
 if(s.startsWith('-')||s.startsWith('+')){sign=s[0]==='-'?-1:1;s=s.slice(1).trim()}
 if(!/[a-z]/.test(s))return sign*number(s)*factors[defaultUnit];
 const re=/(\d+\s+\d+\/\d+|\d+\/\d+|(?:\d+(?:\.\d*)?|\.\d+))\s*(mm|cm|ft|in|yd|m)\b/g;
 let match,end=0,total=0,seen=new Set();while((match=re.exec(s))){if(s.slice(end,match.index).trim())throw Error('Use explicit units, such as 5 ft 7 1/2 in.');if(seen.has(match[2]))throw Error('Enter each unit only once.');seen.add(match[2]);total+=number(match[1])*factors[match[2]];end=re.lastIndex}
 if(!seen.size||s.slice(end).trim())throw Error('Use explicit units, such as 5 ft 7 1/2 in.');return sign*total;
}
function rounded(n){if(!Number.isFinite(n))throw Error('Result is too large.');return Number(n.toFixed(6)).toLocaleString('en-US',{maximumFractionDigits:6})}
function feet(n,precision=16){let ticks=Math.round(Math.abs(n)*precision),ft=Math.floor(ticks/(12*precision)),rest=ticks-ft*12*precision,inch=Math.floor(rest/precision),num=rest%precision,den=precision;while(num&&num%2===0){num/=2;den/=2}return (n<0&&ticks?'-':'')+ft+' ft '+inch+(num?' '+num+'/'+den:'')+' in'}
function solve(mode,input,unit='in'){
 const a=length(input.a,unit),b=['convert'].includes(mode)?0:(['scale','divide'].includes(mode)?scalar(input.b):length(input.b,unit));let value,power=1,extra=[];
 if(mode==='add')value=a+b;
 else if(mode==='subtract')value=a-b;
 else if(mode==='scale')value=a*b;
 else if(mode==='divide'){if(b===0)throw Error('Cannot divide by zero.');value=a/b}
 else if(mode==='ratio'){if(b===0)throw Error('Cannot divide by zero.');return [['Length ratio',rounded(a/b)+' ×']]}
 else if(mode==='convert')value=a;
 else{if(a<=0||b<=0)throw Error('Dimensions must be greater than zero.');if(mode==='area'){value=a*b;power=2;extra=[['Perimeter',feet(2*(a+b))]]}
 else if(mode==='volume'){const c=length(input.c,unit);if(c<=0)throw Error('Depth must be greater than zero.');value=a*b*c;power=3}
 else if(mode==='triangle'){value=Math.hypot(a,b);extra=[['Angle above run',rounded(Math.atan2(a,b)*180/Math.PI)+'°'],['Slope / grade',rounded(a/b*100)+'%']]}
 else if(mode==='spacing'){const count=scalar(input.b);if(!Number.isInteger(count)||count<2||count>10000)throw Error('Use 2–10,000 positions, including both ends.');value=a/(count-1);extra=[['Number of equal gaps',String(count-1)]]}
 else throw Error('Choose a calculation.');}
 if(!Number.isFinite(value))throw Error('Result is too large.');
 if(power===1)return [['Feet & inches (nearest 1/16)',feet(value)],['Decimal inches',rounded(value)+' in'],['Decimal feet',rounded(value/12)+' ft'],['Millimeters',rounded(value*25.4)+' mm'],...extra];
 const names=power===2?['Square feet','Square inches','Square meters']:['Cubic feet','Cubic yards','Cubic meters'];const divisors=power===2?[144,1,Math.pow(1000/25.4,2)]:[1728,46656,Math.pow(1000/25.4,3)];const suffixes=power===2?[' ft²',' in²',' m²']:[' ft³',' yd³',' m³'];return names.map((name,i)=>[name,rounded(value/divisors[i])+suffixes[i]]).concat(extra);
}
const api={length,scalar,feet,solve};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TradeMath=api;
})(typeof globalThis!=='undefined'?globalThis:this);
