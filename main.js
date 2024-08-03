import snarkdown from './libs/snarkdown.js';
import { CreateWebWorkerMLCEngine } from './libs/webllm.js';

const $ = el => document.querySelector(el)

const $chat = $('section')
const $input = $('textarea')
const $msg = $('template').content
const $info = $('mark')

const messages = []
let end = false

const SELECTED_MODEL = 'Llama-3.1-8B-Instruct-q4f16_1-MLC-1k'
// const SELECTED_MODEL = 'Llama-3-8B-Instruct-q4f32_1-MLC-1k'

const engine = await CreateWebWorkerMLCEngine(
    new Worker('./worker.js', { type: 'module' }),
    SELECTED_MODEL,
    {
        initProgressCallback: ({ progress, text }) => {
            $info.dataset.info = text
            if (progress === 1 && !end) {
                end = true
                $info.remove()
                addMessage('Modelo cargado. ¡Hola! ¿En qué puedo ayudarte?', 'bot')
                $input.focus()
            }
        }
    }
)

$input.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        const text = $input.value.trim()
        if (text.length == 0) return
        addMessage(text, 'user')
        messages.push({ content: text, role: 'user' })
        $input.value = ''
        const chunks = await engine.chat.completions.create({
            messages,
            stream: true
        })
        let reply = ''
        const $botMessage = addMessage("", 'bot')
        for await (const chunk of chunks) {
            const choice = chunk.choices[0]
            const content = choice?.delta?.content ?? ""
            reply += content
            $botMessage.innerHTML = snarkdown(reply)
        }

        messages.push({ role: 'bot', content: reply })


        $chat.scrollTo(0, $chat.scrollHeight)
    }
})

function addMessage(text, sender) {
    const $clonedTemplate = $msg.cloneNode(true)
    const $newMessage = $clonedTemplate.querySelector('.msg')
    $newMessage.classList.add(sender)
    let html = snarkdown(text)
    $newMessage.innerHTML = html
    $chat.appendChild($clonedTemplate)
    $chat.scrollTo(0, $chat.scrollHeight)

    return $newMessage
}