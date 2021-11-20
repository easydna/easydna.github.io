const staticEasyDNA = "easy-DNA-v1"

const assets = [

  "/",
  "/index.html",
  "/bootstrap.css",
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


function syncDNA(){

    const request = indexedDB.open('easy_dna',1)
    let db

    request.onsuccess = function(){

        db = this.result

        let tr = db.transaction('comunicado','readwrite')
        let store = tr.objectStore('comunicado')

        console.log(store.getAll())

    }
}

self.addEventListener('sync', function(event) {
	
    console.log("sync event", event);
  
    if (event.tag === 'syncDNAs'){

        syncDNA()
    }

});

