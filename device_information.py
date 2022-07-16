import platform
import psutil
from time import sleep


print("\nCarregando as informações...")

informacoes = {}

# - Nome do sistema
nome_sistema = platform.system()
informacoes["Nome do Sistema"] = nome_sistema

# - Versão do sistema
versao_sistema = platform.platform()
platform.release()
informacoes["Versão do Sistema"] = versao_sistema

# - Nome do processador
processador = platform.processor()
informacoes["Nome do Processador"] = processador

# - Detalhes da arquitetura
arquitetura = platform.architecture()
informacoes["Arquitetura"] = arquitetura

# - Máquina
maquina = platform.machine()
informacoes["Máquina"] = maquina

# - Rede
rede = platform.node()
informacoes["Rede"] = rede

# - Uso da CPU (intervalo de 4 segundos)
porcentagem_cpu = psutil.cpu_percent(4)
informacoes["Porcentagem da CPU"] = porcentagem_cpu

# - Uso de memória RAM
porcentagem_ram = psutil.virtual_memory()[2]
informacoes["Porcentagem de RAM"] = porcentagem_ram

# - Bateria
bateria = psutil.sensors_battery()

# Porcentagem:
porcentagem_bateria = str(bateria.percent)
# Está carregando ou não
carregando = bateria.power_plugged

plugado = "ligado à bateria"
if carregando:
    plugado = "ligado à tomada"
else:
    plugado = "ligado à bateria"

informacoes["Porcentagem de Bateria"] = porcentagem_bateria
informacoes["Modo de Energia"] = plugado

print("\nInformações:")
for item, valor in informacoes.items():
    print(f"- {item}: {valor}")
    sleep(1)

print("\nProcesso finalizado.")
print(informacoes)
