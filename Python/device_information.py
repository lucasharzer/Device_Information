import platform
import getpass
import psutil
import GPUtil
import time


class SystemInfo:
    def __init__(self):
        self.informacoes = {}
        self.collect_info()
    
    def collect_info(self):
        print("\nCarregando as informações...")
        # - Nome do sistema
        self.informacoes["Nome do Sistema"] = platform.system()
        # - Versão do sistema
        self.informacoes["Versão do Sistema"] = platform.platform()
        # - Nome do processador
        self.informacoes["Nome do Processador"] = platform.processor()
        # - Detalhes da arquitetura
        arquitetura = platform.architecture()
        self.informacoes["Arquitetura"] = f"{arquitetura[0]} | {arquitetura[1]}"
        # - Usuário do sistema
        self.informacoes["Usuário"] = getpass.getuser()
        # - Máquina
        self.informacoes["Máquina"] = platform.machine()
        # - Rede
        self.informacoes["Rede"] = platform.node()
        # - Uso da CPU (intervalo de 4 segundos)
        self.informacoes["Porcentagem da CPU"] = self.convert_value(psutil.cpu_percent(4)) + "%"
        # - Uso de memória RAM
        self.informacoes["Porcentagem de RAM"] = self.convert_value(psutil.virtual_memory().percent) + "%"
        # - Bateria
        bateria = psutil.sensors_battery()
        porcentagem_bateria = str(bateria.percent)
        carregando = bateria.power_plugged
        self.informacoes["Porcentagem de Bateria"] = self.convert_value(porcentagem_bateria) + "%"
        self.informacoes["Modo de Energia"] = "ligado à tomada" if carregando else "ligado à bateria"
        # - Discos
        self.informacoes["Discos"] = self.disk_info()
        # - Placas de Vídeo
        self.informacoes["Placas de Vídeo"] = self.gpu_info()
        # - Tempo de Atividade
        self.informacoes["Tempo de Atividade"] = f"{self.convert_value(self.get_uptime())} horas"
    
    # Informações sobre o disco
    def disk_info(self):
        disk_info = []
        for particao in psutil.disk_partitions():
            usage = psutil.disk_usage(particao.mountpoint)
            disk_info.append({
                "Disco": particao.device,
                "Tipo": particao.fstype,
                "Espaço Total (GB)": self.convert_value(usage.total / (1024 ** 3)),
                "Espaço Livre (GB)": self.convert_value(usage.free / (1024 ** 3)),
                "Espaço Usado (GB)": self.convert_value(usage.used / (1024 ** 3)),
                "Uso (%)": self.convert_value(usage.percent)
            })
        return disk_info

    # Informações sobre a(s) GPU(s)
    def gpu_info(self):
        gpus = GPUtil.getGPUs()
        gpu_info = []
        for gpu in gpus:
            gpu_info.append({
                "ID": gpu.id,
                "Nome": gpu.name,
                "Memória Total (MB)": self.convert_value(gpu.memoryTotal),
                "Memória Livre (MB)": self.convert_value(gpu.memoryFree),
                "Memória Usada (MB)": self.convert_value(gpu.memoryUsed),
                "Uso (%)": self.convert_value(gpu.memoryUtil * 100)
            })
        return gpu_info

    # Obter tempo de funcionamento do sistema
    def get_uptime(self):
        boot_time = psutil.boot_time()
        uptime = time.time() - boot_time
        return uptime / 3600
    
    def convert_value(self, valor):
        return str(round(float(valor), 2)).replace(".", ",")

    def print_info(self):
        print("\nInformações:")
        for item, valor in self.informacoes.items():
            print(f"- {item}: {valor}")
            time.sleep(0.3)
        print("\nProcesso finalizado.")


# Instanciando e usando a classe
if __name__ == "__main__":
    system_info = SystemInfo()
    system_info.print_info()
