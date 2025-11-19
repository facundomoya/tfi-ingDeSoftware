// simple wrapper para llamadas al backend
export async function altaPaciente(payload){
const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/pacientes/alta", {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
const body = await res.json().catch(()=>null);
if(!res.ok){
const msg = body?.message || body?.error || 'Error en la petición';
const err = new Error(msg);
err.httpStatus = res.status;
err.body = body;
throw err;
}
return body;
}