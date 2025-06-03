# CSV Importer com Matching Inteligente de Colunas

Este projeto implementa um sistema de importação de CSV que utiliza IA para fazer o matching automático entre as colunas do arquivo CSV e um esquema de dados predefinido.

## Como Funciona

### 1. Interface do Usuário (`page.tsx`)
- **Upload de arquivo**: Interface permite selecionar arquivos CSV
- **Parse do CSV**: Utiliza Papa Parse para processar o arquivo
- **Envio para API**: Envia as colunas do CSV + amostras de dados para análise
- **Aplicação do mapping**: Recebe o mapeamento e aplica aos dados para exibição

### 2. API de Matching (`/api/match-columns/route.ts`)
- **Recebe dados**: Colunas do CSV, linhas de exemplo e esquema esperado
- **IA para matching**: Usa OpenAI GPT-4o-mini para analisar e mapear colunas
- **Retorna mapeamento**: JSON com correspondência entre colunas CSV → esquema padrão

## Fluxo de Dados

```
CSV Upload → Parse → API Call → OpenAI Analysis → Column Mapping → Data Display
```

### Exemplo de Mapping
```json
{
  "nome": "firstName",
  "sobrenome": "lastName", 
  "email": "email"
}
```

## Esquema Padrão
O sistema espera dados com as seguintes colunas:
- `firstName` (First Name)
- `lastName` (Last Name) 
- `email` (Email)

A IA automaticamente identifica qual coluna do CSV corresponde a cada campo esperado, mesmo com nomes diferentes ou em outros idiomas.
