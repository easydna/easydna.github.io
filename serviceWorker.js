
const staticEasyDNA = "easy-DNA-v1"

const assets = [

  "/",
  "/index.html",
  "/bootstrap.css",
  "/manifest.json",
  "/scripts/axios.js",
  "/scripts/dexie.js",
  "/scripts/vue.js",
  "/scripts/uuidv4.js",
  "/scripts/email.js",

  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-32x32.png",

  "/listas/equipamento.js",
  "/listas/equipe.js",
  "/listas/situacao.js",

]

self.addEventListener("install", installEvent => {
console.log("Install service worker")
  installEvent.waitUntil(
    caches.open(staticEasyDNA).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
})

self.importScripts('./scripts/dexie.js')
self.importScripts('./scripts/axios.js')

axios.defaults.headers = {

    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Content-Type': 'application/json'
}

async function syncDNA(){

    console.log('syncDNA')
    const db = new Dexie('easy_dna')
    
    db.version(1).stores({

        comunicado:'uuid, np,nome,data,unidade,gerencia,equipe,equipamento,humor,categoria,item,situacao,texto,token'
    })

    try{

        let dnas = await db.comunicado.toArray()

        for(let dna of dnas){

            let res = await fetch("https://formsubmit.co/ajax/9687fb9ed847546e3fc748689a393310", {

                method: "POST", cache:'no-cache', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify(dna)

            })

            await db.comunicado.where('uuid').equals(dna.uuid).delete()
        }
    }
    catch(err){

        console.error(err)
    }
}


self.addEventListener('sync', function(event) {

    event.waitUntil(syncDNA())

});