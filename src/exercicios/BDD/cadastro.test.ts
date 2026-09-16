import { cadastrarCliente, NovoCliente } from "./cadastro"

type EnderecoMock = {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
}

type RejectMock = {
    message: string
}


function responseFactory(body: unknown, { ok =  true, status = 200} = {}) {

    return {
        ok,
        status,
        json: async () => body
    } as unknown as Response
}


function fetchMocked(reponse: Response) {
    const fetchMock = vi.fn(async => reponse)
    vi.stubGlobal('fetch',fetchMock)
}




describe('function -> cadastrarCliente', () => {

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('deve retornar endereço valido', async () => {

        // Arrange
        const responseMock = responseFactory({
            cep: '11111-221',
            logradouro: 'Rua da paz',
            bairro: 'Bairro de cima',
            localidade: 'Porto Alegre',
            uf: 'RS'
        })
        fetchMocked(responseMock)
    
      

        const cliente: NovoCliente = {
            cep: '17206438',
            nome: 'Bruno'
        }


        // Act
        const result = await cadastrarCliente(cliente)
      

        // Assert
        expect(result).toStrictEqual({
            nome: 'Bruno',
            endereco: {
            cep: '11111221',
            logradouro: 'Rua da paz',
            bairro: 'Bairro de cima',
            cidade: 'Porto Alegre',
            uf: 'RS'
        }
        })
    })

    it('deve retornar erro da API', async () => {
        //Arrange
         const responseMock = responseFactory({
            cep: '11111-221',
            logradouro: 'Rua da paz',
            bairro: 'Bairro de cima',
            localidade: 'Porto Alegre',
            uf: 'RS'
        }, {ok: false, status: 500})
        fetchMocked(responseMock)
    
        const cliente = {
            nome: 'John',
            cep: '11111221'
        };

        // Act & Assert
        await expect(cadastrarCliente(cliente)).rejects.toThrow('Não foi possível consultar o CEP agora, tente novamente')
    })
})