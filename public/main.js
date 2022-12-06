//const PUBLIC_VAPID_KEY='BB8GcWxwhiYJfMot6T_PF9YmYaK5qXBFCsd6sDcVpj92nUS01TIR4yXYTfBGAc7XG25d9hxGpBJNMHyhhKDj1lM'
const PUBLIC_VAPID_KEY = 'BKK0zMJFd-U67AzOH8EgjRL9LOkRPRAbp_GIIyggWsDCYhxR8oKdj4Q0HkV5b8vF2jnkAPM4F_A1vmUVS501UHk'

function subscribe() {
    navigator.serviceWorker.ready.then(worker => {
        worker.pushManager.subscribe({
            userVisibleOnly : true,
            applicationServerKey : PUBLIC_VAPID_KEY
        }).then(response => {
            fetch('http://localhost:5000/subscribirse',{
                method: 'POST',
                body: JSON.stringify(response),
                headers: {
                    "Content-Type" : "application/json"
                } 
            })
        })    
    })
}

window.addEventListener('load', async () => {
    const service = await navigator.serviceWorker.register('/serviceWorker.js') 
    if(service.active)
        subscribe()
})

