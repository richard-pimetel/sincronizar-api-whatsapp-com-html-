const numeroUser = "11987876567";
const BASE_URL = 'https://api-api-8mgw.onrender.com/v1/whatsapp';

async function renderConversa(name) {
    const conversa = document.getElementById("conversa");
    conversa.replaceChildren('');
    try {
        const response = await fetch(`${BASE_URL}/filter/?nu=${numeroUser}&na=${encodeURIComponent(name)}`);
        const data = await response.json();
        const mensagens = data.messages;
        
        // Check if mensagens is an array before using forEach
        if (Array.isArray(mensagens)) {
            mensagens.forEach(renderMensagem);
        } else {
            console.error('Received invalid data format:', data);
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.textContent = "Não foi possível carregar as mensagens";
            conversa.appendChild(errorMessage);
        }
    } catch (error) {
        console.error('Erro ao buscar conversas:', error);
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = "Erro ao carregar mensagens";
        conversa.appendChild(errorMessage);
    }
}

function criarCampoDeConversa(name) {
    const right = document.getElementById("right");
    right.replaceChildren('');

    const top = document.createElement("div");
    top.className = "top";

    const contato = document.createElement("div");
    contato.className = "contato";

    const img = document.createElement("img");
    img.src = "https://i.pinimg.com/136x136/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg";
    img.alt = "Imagem do contato";

    const h2 = document.createElement("h2");
    h2.textContent = name;

    contato.appendChild(img);
    contato.appendChild(h2);

    const confg = document.createElement("div");
    confg.className = "confg";

    const botaoBusca = document.createElement("button");
    const iconeBusca = document.createElement("ion-icon");
    iconeBusca.setAttribute("name", "search");
    botaoBusca.appendChild(iconeBusca);

    const botaoMais = document.createElement("button");
    const iconeMais = document.createElement("ion-icon");
    iconeMais.setAttribute("name", "ellipsis-vertical");
    botaoMais.appendChild(iconeMais);

    confg.appendChild(botaoBusca);
    confg.appendChild(botaoMais);

    top.appendChild(contato);
    top.appendChild(confg);

    const conversa = document.createElement("div");
    conversa.id = "conversa";

    const envio = document.createElement("div");
    envio.id = "envio";

    const envioInputDiv = document.createElement("div");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Escreva sua mensagem";
    
    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            try {
                await fetch(`${BASE_URL}/filter/?nu=${numeroUser}&na=${encodeURIComponent(name)}&wo=${encodeURIComponent(input.value)}`);
                await renderConversa(name);
                input.value = '';
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        }
    });
    
    envioInputDiv.appendChild(input);

    const botaoEnviar = document.createElement("button");
    const iconeEnviar = document.createElement("ion-icon");
    iconeEnviar.setAttribute("name", "send");
    botaoEnviar.appendChild(iconeEnviar);
    
    botaoEnviar.addEventListener('click', async () => {
        if (input.value.trim() !== '') {
            try {
                await fetch(`${BASE_URL}/filter/?nu=${numeroUser}&na=${encodeURIComponent(name)}&wo=${encodeURIComponent(input.value)}`);
                await renderConversa(name);
                input.value = '';
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        }
    });

    envio.appendChild(envioInputDiv);
    envio.appendChild(botaoEnviar);

    right.appendChild(top);
    right.appendChild(conversa);
    right.appendChild(envio);
}

function renderMensagem(element) {
    const conversa = document.getElementById("conversa");
    const caixaDaMensagem = document.createElement("div");
    caixaDaMensagem.className = "linhaMensagem";
    const mensagem = document.createElement("div");
    mensagem.className = "mensagem";
    
    if (element.sender == "me") {
        mensagem.classList.add("meMensagem");
    } else {
        mensagem.classList.add("contatoMensagem");
    }
    
    const p = document.createElement("p");
    p.textContent = element.content;
    const span = document.createElement("span");
    span.textContent = element.time;
    mensagem.appendChild(p);
    mensagem.appendChild(span);
    caixaDaMensagem.appendChild(mensagem);
    conversa.appendChild(caixaDaMensagem);
    
    conversa.scrollTop = conversa.scrollHeight;
}

async function renderContatos() {
    try {
        const response = await fetch(`${BASE_URL}/data/contact/user/?nu=${numeroUser}`);
        const data = await response.json();
        if (data && Array.isArray(data.contacts)) {
            data.contacts.forEach(cardContato);
        } else {
            console.error('Contacts data is not properly formatted:', data);
            const lista = document.getElementById("contatos");
            lista.innerHTML = '<div class="error">Não foi possível carregar os contatos</div>';
        }
    } catch (error) {
        console.error('Erro ao buscar contatos:', error);
    }
}

async function cardContato(element) {
    const lista = document.getElementById("contatos");
    const contato = document.createElement("div");
    contato.className = "contato";
    const perfil = document.createElement("div");
    perfil.className = "perfil";
    const img = document.createElement("img");
    img.src = "https://i.pinimg.com/136x136/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg";
    const perfilDados = document.createElement("div");
    perfilDados.className = "perfilDados";
    const titulo = document.createElement("h3");
    titulo.textContent = element.name;
    const descricao = document.createElement("span");
    descricao.textContent = element.description;

    contato.addEventListener('click', async () => {
        criarCampoDeConversa(element.name);
        await renderConversa(element.name);
        if (window.innerWidth <= 768) {
            document.getElementById("left").classList.remove("chatTotal");
        }
    });

    perfil.appendChild(img);
    contato.appendChild(perfil);
    perfilDados.appendChild(titulo);
    perfilDados.appendChild(descricao);
    contato.appendChild(perfilDados);
    lista.appendChild(contato);
}

function abrirChat() {
    const Contatos = document.getElementById("left");
    Contatos.classList.toggle("chatTotal");
}

const buttonChat = document.getElementById("chat");
buttonChat.addEventListener('click', abrirChat);

// Inicializar a lista de contatos
renderContatos();