const os = require("os")


console.log("\nCarregando as informações...")

let informacoes = {}

// - Arquitetura
informacoes["Arquitetura"] = os.arch()

// - Plataforma
informacoes["Plataforma"] = os.platform()

// - Detalhes da CPU
informacoes["Detalhes da CPU"] = os.cpus()

// - Quantidade da CPU
informacoes["Quantidade de CPU"] = os.cpus().length

// - Memória total (Gb)
const memoria_total = (os.totalmem()/1024)/1024
informacoes["Memória Total"] = memoria_total

// - Memória livre (Gb)
const memoria_livre = (os.freemem()/1024)/1024
informacoes["Memória Livre"] = memoria_livre

// Porcentagem de memória livre (%)
const porcentagem = (memoria_livre/memoria_total)*100
informacoes["Porcentagem de Memória Livre"] = porcentagem

// Tempo da máquina ligada (horas)
const tempo = (os.uptime()/60)/60
informacoes["Uptime"] = tempo

// Interfaces de redes
informacoes["Interfaces de Redes"] = os.networkInterfaces()

// Caminho do usuário
informacoes["Caminho do Usuário"] = os.homedir()

// Versão do Sistema Operacional
informacoes["Versão do Sistema Operacional"] = os.release()

// Sistema Operacional
informacoes["Sistema Operacional"] = os.type()

// Nome do Host
// informacoes["Hostname"] = os.hostname()

console.log("\nInformações:")
for (const item in informacoes){
    console.log(`- ${item}: ${informacoes[item]}`)
}