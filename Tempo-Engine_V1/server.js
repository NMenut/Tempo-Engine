
//configurer notre serveur 
// npm init 
let express = require('express')
let app = express()
let querySelectorAll = require('query-selector')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let bodyParser = require('body-parser')
let session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
let http = require('http')
let fs = require('fs')

//MOTEUR DE TEMPLATES
app.set('view engine','ejs')

app.use(express.static('public'))
// parse application/x-www-form-urlencoded

// parse application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(express.json())

//je vais utiliser la socket pour créer un pont entre le client et le 
//serveur
let server = http.createServer(app)

let io = require("socket.io").listen(server)

app.get('/',(request,response)=>
{
  let truc = fs.readFileSync('./write.json')
  let aff = JSON.parse(truc)
  let num = aff.tempo
  response.render('pages/index',{messages : num})
  io.sockets.on('connection',function(socket)
    {
      console.log('un client est connecté')

      //Le socket va nous permettre decouter ce que fait notre client 
      socket.on('message',function(message)
      {
        // donc cest ici que nous recupererons la valeur au moment ou il y aura un changement
        let tempo = 
        {
          'tempo' : message
        }
        //ici je vais modifier notre fichier JSON 
        let donnees = JSON.stringify(tempo)
        fs.writeFileSync('./write.json',donnees)
      })
    })

})


app.post('/', (request,response)=>
{   

  let truc = fs.readFileSync('./write.json')
  let aff = JSON.parse(truc)
  console.log(aff.tempo)
  io.sockets.on('connection',function(socket)
  {

    //Le socket va nous permettre decouter ce que fait notre client 
    socket.on('message',function(message)
    {
      let truc = fs.readFileSync('./write.json')
      let aff = JSON.parse(truc)
    })
  })
  response.redirect('/')
})

server.listen(8080)





