import { WebWorkerMLCEngineHandler } from "./libs/webllm.js"

const handler = new WebWorkerMLCEngineHandler()

self.onmessage = (msg) => {
    handler.onmessage(msg)
}