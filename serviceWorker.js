
const staticEasyDNA = "easy-DNA-v1"
const  workerToPage  = new BroadcastChannel('channel1')
const  pageToWorker = new BroadcastChannel('channel2')

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

    workerToPage.postMessage({get:'DNAS'})

    pageToWorker.onmessage = (event) => {
        
        let items = event.data.items
        
        try{

            if(!Array.isArray(items)){

                return
            }

            for(let item of items){

                fetch("https://formsubmit.co/ajax/9687fb9ed847546e3fc748689a393310", {

                    method: "POST",
                    headers: {

                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: item[1]

                }).then(res => {

                    workerToPage.postMessage({delete:item[0]})
                })
                .catch(e => {

                    console.log('Erroa ao sincronizar',e)
                })
            }
        
        }
        catch(e) {

            console.log('Erro no SW',e)
        }
    }
}

self.addEventListener('sync', function(event) {
    
    syncDNA()

});

