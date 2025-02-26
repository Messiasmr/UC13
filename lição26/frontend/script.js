document.getElementById('cep').addEventListener('blur', async function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert('CEP inválido, deve ter 8 digitos');
        return;
    }
    try {
        // faz uma requisição para o backend para buscar o cep informado
        const response = await fetch(`https://localhost:3000/api/cep${cep}`);
        if (!response.ok) {
            throw new Error('erro ao buscar o cep');
        }
        const data = await response.json();
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }
        // processar os dados do CEP aqui
        document.getElementById('logradouro').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('estado').value = data.uf;

        //Adicionar um feedbake visual para o usuário
        document.querySelectorAll(`.form-group`).forEach(input => {
            input.style.boderColor = '#6a11cb';
        })
    } catch (error) {
        console.error('erro ao buscar cep',error);
        alert('Erro ao buscar o CEP');
    }
});

