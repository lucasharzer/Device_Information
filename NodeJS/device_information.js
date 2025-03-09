const si = require('systeminformation');
const diskinfo = require('diskinfo');
const gpuInfo = require('gpu-info');
const os = require("os");


class SistemaInformacoes {
    constructor() {
        this.informacoes = {};
    }

    // Método para obter informações do sistema
    async obterInformacoes() {
        console.log("\nCarregando as informações...");
        const cpus = os.cpus();

        // Coleta de informações do sistema
        this.informacoes["Arquitetura"] = os.arch();
        this.informacoes["Plataforma"] = os.platform();
        this.informacoes["Processador"] = cpus[0].model;

        // Memória
        const memoria_total = (os.totalmem() / 1024) / 1024;
        this.informacoes["Memória RAM Total (GB)"] = memoria_total.toFixed(2);
        const memoria_livre = (os.freemem() / 1024) / 1024;
        this.informacoes["Memória Livre (GB)"] = memoria_livre.toFixed(2);
        const porcentagem = (memoria_livre / memoria_total) * 100;
        this.informacoes["Porcentagem de Memória Livre"] = `${porcentagem.toFixed(2)}%`;

        // Tempo da máquina ligada
        const tempo = (os.uptime() / 60) / 60;
        this.informacoes["Uptime"] = tempo.toFixed(2);

        // Interfaces de redes
        this.informacoes["Interfaces de Redes"] = this.obterInformacoesRedes();
        // Caminho do usuário
        this.informacoes["Caminho do Usuário"] = os.homedir();
        // Versão do Sistema Operacional
        this.informacoes["Versão do Sistema Operacional"] = os.release();
        // Sistema Operacional
        this.informacoes["Sistema Operacional"] = os.type();
        // Nome do Host
        this.informacoes["Hostname"] = os.hostname();

        // Informações sobre CPUs
        const cpuInfoList = cpus.map((cpu, index) => {
            return `\n-- CPU ${index + 1}:\nModelo: ${cpu.model}\nNúcleos: ${cpu.cores}\nTempo de Idle: ${cpu.times.idle} ns\nTempo de Usuário: ${cpu.times.user} ns\nTempo de Sistema: ${cpu.times.sys} ns`;
        });
        this.informacoes["Quantidade de CPU"] = cpus.length;
        this.informacoes["CPUs"] = cpuInfoList;

        // Informações sobre a bateria
        this.informacoes["Bateria"] = await this.obterInformacoesBateria();
        // Informações sobre o disco
        this.informacoes["Disco"] = await this.obterInformacoesDisco();
        // Informações sobre a GPU
        this.informacoes["GPU"] = await this.obterInformacoesGPU();
    }

    // Método para obter interfaces de rede
    obterInformacoesRedes() {
        const interfaces = os.networkInterfaces();
        const informacoesRedes = Object.keys(interfaces).map(interfaceName => {
            const infos = interfaces[interfaceName];
            return infos.map(info => 
                `\n-- Interface ${interfaceName}\nEndereço: ${info.address}\nTipo: ${info.family}\nIPv6: ${info.internal ? 'Interno' : 'Externo'}\n${info.mac ? `MAC: ${info.mac}` : ''}`
            );
        });
        return informacoesRedes;
    }

    // Método para obter informações da bateria
    async obterInformacoesBateria() {
        try {
            const battery = await si.battery();
            return [
                `\nPercentual: ${battery.percent}%`,
                `\nTempo Restante: ${battery.timeRemaining} minutos`,
                `\nStatus de Carregamento: ${battery.isCharging ? 'Carregando' : 'Descarregando'}`,
                `\nNível de Energia: ${battery.powerPlugged ? 'Plugado' : 'Desconectado'}`
            ];
        } catch (error) {
            console.error('Erro ao obter informações da bateria: ', error);
            return [];
        }
    }

    // Método para obter informações do disco
    async obterInformacoesDisco() {
        return new Promise((resolve, reject) => {
            diskinfo.getDrives((err, drives) => {
                if (err) {
                    reject('Erro ao obter informações de disco: ' + err);
                    return;
                }
                const informacoesDisco = drives.map(drive => 
                    `\nTipo do Disco ${drive.mounted}\nDisco: ${drive.filesystem}\nTotal: ${(drive.blocks / 1024 / 1024 / 1024).toFixed(2)} GB\nUsado: ${(drive.used / 1024 / 1024 / 1024).toFixed(2)} GB\nLivre: ${(drive.available / 1024 / 1024 / 1024).toFixed(2)} GB\nPercentual Usado: ${(drive.used / drive.blocks * 100).toFixed(2)}%`
                );
                resolve(informacoesDisco);
            });
        });
    }

    // Método para obter informações da GPU
    async obterInformacoesGPU() {
        try {
            const gpus = await gpuInfo();
            if (!Array.isArray(gpus)) {
                throw new Error('Dados de GPU inesperados.');
            }

            const informacoesGPU = gpus.map((gpu, index) => {
                // Garantir que as propriedades existam antes de acessá-las
                const model = gpu.model || 'Desconhecido';
                const vendor = gpu.vendor || 'Desconhecido';
                const totalMemory = gpu.memory?.total ? (gpu.memory.total / 1024 / 1024).toFixed(2) + ' MB' : 'N/A';
                const usedMemory = gpu.memory?.used ? (gpu.memory.used / 1024 / 1024).toFixed(2) + ' MB' : 'N/A';
                const freeMemory = gpu.memory?.free ? (gpu.memory.free / 1024 / 1024).toFixed(2) + ' MB' : 'N/A';
                const temperature = gpu.temperature ? gpu.temperature + ' °C' : 'N/A';

                return `\n-- GPU ${index + 1}:\nModelo: ${model}\nFabricante: ${vendor}\nMemória Total: ${totalMemory}\nMemória Usada: ${usedMemory}\nMemória Livre: ${freeMemory}\nTemperatura: ${temperature}`;
            });

            return informacoesGPU;
        } catch (err) {
            console.error('Erro ao obter informações da GPU:', err);
            return [];
        }
    }

    // Método para exibir as informações
    exibirInformacoes() {
        console.log("\nInformações:");
        for (const item in this.informacoes) {
            console.log(`- ${item}: ${this.informacoes[item]}`);
        }
    }
}


(async () => {
    const sistema = new SistemaInformacoes();
    await sistema.obterInformacoes();
    sistema.exibirInformacoes();
})();