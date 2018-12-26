const fs = require("fs");


let nivelMaximo = 5;

function viclog(s, nivel = 2) {
    if (nivel <= nivelMaximo) {
        console.log(`--${nivel}-> ${s}`);
    }
}




/**
 * Retorna uma string com a primeira letra minúscula
 */
module.exports.primeiraMaiuscula = function (string) {
    return string.charAt(0).toUpperCase() + string.substr(1);
}

/**
 * Cria um arquivo ou sobescreve um arquivo apenas se for diferente ou não possuir VICIGNORE na primeira linha 
 */
module.exports.escreveArquivo = function (arquivo, src, enc) {
    if (fs.existsSync(arquivo)) {
        let text = fs.readFileSync(arquivo, "utf8");
        let data = text.split("\n");
        if (data[0].indexOf('VICIGNORE') != -1) {
            viclog(`VICIGNORE encontrado na primeira linha, não sobreescrevendo arquivo ${arquivo}`);
            return;
        }
        if (text == src) {
            viclog(`Arquivos idênticos, não sobreescrevendo arquivo ${arquivo}`, 6)
            return;

        }
        viclog(`Atualizando arquivo ${arquivo}`)
    }
    else {
        viclog(`Criando arquivo ${arquivo}`)
    }
    fs.writeFileSync(arquivo, src, enc);
}

module.exports.escreveArquivoApenasSeNaoExistir = function (arquivo, src, enc) {
    if (!fs.existsSync(arquivo)) {
        viclog(`Criando arquivo ${arquivo}`);
        fs.writeFileSync(arquivo, src, enc);
    }
}



module.exports.insereLinhaAntes = function (arquivo, marcador, novaLinha) {
    let linhaInserida = false;
    let text = fs.readFileSync(arquivo, "utf8");
    if (text.indexOf(novaLinha) != -1) {
        viclog(`${arquivo} já contem a linha ${novaLinha}`, 6);
        return; //Se ja tiver inserido não coloca novamente
    }
    let data = text.split("\n");
    let newData = [];
    data.forEach(linha => {
        if (linha.indexOf(marcador) != -1) {
            newData.push(novaLinha);
            viclog(`${arquivo} adicionando linha ${novaLinha} antes de ${linha}`);
            linhaInserida = true;
        }
        newData.push(linha);
    })
    let saida = newData.join("\n");
    if (linhaInserida) {
        this.escreveArquivo(arquivo, saida, "utf8");
    }
}

module.exports.criaPasta = function (path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        viclog(`Criando pasta ${path}`);
    }
}


module.exports.pacotePrincipal = function (project) {
    let package = "";
    project.description.softwareHouseDomain.toLowerCase().split('.').reverse().forEach(element => {
        package += `.${element}`;

    });
    package = package.substr(1);
    return package;
}