
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

function onerror(e){console.error('Erro on SW',e.target)}

function opendDb(cb){

    const t = indexedDB.open('easy_dna',10)

    t.onerror = onerror
    t.onsuccess = function(event) {

        cb(t.result)
    }
    t.onupgradeneeded = function(event){

        let db = event.target.result

        if(!db.objectStoreNames.contains('comunicado')) {

			var store = Db.createObjectStore('comunicado', {keyPath: 'uuid'})
		}

        opendDb(cb)
    }
}

function getResults(cb){

    opendDb(function(db){

        let t = db.transaction(['comunicado'],"readonly").objectStore('comunicado').getAll()
        t.onerror = onerror
        t.onsuccess = function(){

            cb(t.result)
        }
    })
}

function deleteItem(id){

    opendDb(function(db){

        let t = db.transaction(['comunicado'],"readwrite")
        let store = t.objectStore('comunicado')
        let delReq = store.delete(id)

        delReq.onerror = onerror
    })
}

function syncDNA(){
    console.log('Sync')
   getResults((result) => {
    console.log(result)
    return
        if(Array.isArray(result)){

            for(let item of result){

                fetch("https://formsubmit.co/ajax/9687fb9ed847546e3fc748689a393310", {

                    method: "POST",
                    headers: {

                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(item)

                }).then(res => {

                    console.log('Item synced and removed')
                    deleteItem(item.uuid)
                    
                })
                .catch(e => {

                    console.log('Erro ao sincronizar - SW',e)
                })
            }

        }
    })
}

self.addEventListener('sync', function(event) {

    setTimeout( _ => {

        syncDNA()

    },30000)

});

