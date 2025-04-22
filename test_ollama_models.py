from axis_modules.axis_model_dispatcher import perguntar_para_modelo

modelos = [
    "phi-2-super",
    "mistral-7b-instruct-v0.3",
    "deepseek-r1-distill-qwen-7b",
    "meta-llama-3.1-8b-instruct",
    "phi-3.1-mini-128k-instruct",
    "nomic-embed-text-v1.5"
]

pergunta = "Explique o conceito de VO2máx em até 2 linhas."

for modelo in modelos:
    print(f"\n Testando modelo: {modelo}")
    try:
        resposta = perguntar_para_modelo(modelo, pergunta)
        print(f" {modelo} respondeu:\n{resposta}")
    except Exception as e:
        print(f" Erro ao testar {modelo}: {e}")
