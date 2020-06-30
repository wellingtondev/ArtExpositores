const express = require("express");
const server = express();

// Pegar o banco de dados

const db = require("./database/db.js")

// Configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true}))

// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// Configurar caminhos da minha aplicação

// Página Inicial
// req: Requisicao
// res: Resposta

//npm install nodemon -> Monitora as alterações do servidor
server.get("/", (req, res) => { 
    return res.render("index.html", { title: "Seu marketplace de coleta de resíduos."}) // Variavel global do node, que eu contateno minha string

})

server.get("/create-point", (req, res) => { 
    // req.query: Query Strings na nossa URL
    console.log(req.query)

    return res.render("create-point.html") // Variavel global do node, que eu contateno minha string
})

server.post("/savepoint", (req, res) => {
    
    // req.body: O corpo do nosso formulário

    // inserir dados no banco de dados
    // 2- Inserir dados na tabela CALLBACK -> Tem um estilo de "CHAME ESSA FUNÇÃO DE VOLTA"
const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
    `

const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com Sucesso")
        console.log(this) // o this dentro dessa funcao , ele referencia a resposta que o run ta trazendo para nós

        return res.render("create-point.html", { saved: true})
    }
    db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => { 

    const search = req.query.search

    if(search == ""){
        // Pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }
    // Pegar os dados do banco de dados -> LIKE Filtra qualquer valor ou qualquer valor depois para o FILTRO DO BANCO NO SEARCH
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){ //(err, rows) <- É um argumento da função, só vai funcionar dentro da função
        if(err){
            return console.log(err)
        }

        const total = rows.length
        console.log("Aqui estão seus registros")
        console.log(rows)

        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total}) // Variavel global do node, que eu contateno minha string
    })

})


// Ligar o servidor
server.listen(3000) // Função que ouve a porta