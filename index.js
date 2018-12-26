const request = require('request');
const fs = require("fs");
const util = require("./util");
const ident = "    ";


function corrigeTipo(f) {
    if (f.name == "id") {
        return "string";
    }
    if (f.type == "datetime") {
        return "string";
    }
    if (f.type == "text") {
        return "string";
    }

    return f.type;
}

function geraType(schema) {
    const tableName = schema.name;
    let src = `export interface ${util.primeiraMaiuscula(tableName)} {\n`;
    schema.field.forEach(f => {
        src += `${ident}${f.name}?: ${corrigeTipo(f)};\n`;

    });

    src += `}\n`;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/${tableName.toLocaleLowerCase()}.type.ts`, src, `utf8`);

}

function geraService(schema) {
    const tableName = schema.name;
    let src = `
import { Injectable } from '@angular/core';
import { SuperService } from '../comum/super-service';
import { ${util.primeiraMaiuscula(tableName)} } from './${tableName.toLocaleLowerCase()}.type';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class ${util.primeiraMaiuscula(tableName)}Service extends SuperService<${util.primeiraMaiuscula(tableName)}>{

  constructor(http: HttpClient, loginService: LoginService) {
    super("${tableName}", http, loginService);
  }
  newObject(): ${util.primeiraMaiuscula(tableName)} {
    return { }  as ${util.primeiraMaiuscula(tableName)};
  }
}
`;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/${tableName.toLocaleLowerCase()}.service.ts`, src, `utf8`);
}



function geraRoutingModule(schema) {
    const tableName = schema.name;
    let src = `
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudComponent } from './crud/crud.component';
import { ListaComponent } from './lista/lista.component';
import { DetalhesComponent } from './detalhes/detalhes.component';

const routes: Routes = [

  {
    path: '${tableName.toLocaleLowerCase()}', component: CrudComponent,
    children: [
      { path: '', component: ListaComponent },
      { path: 'detalhes/:id', component: DetalhesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ${util.primeiraMaiuscula(tableName)}RoutingModule { }
    
    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/${tableName.toLocaleLowerCase()}-routing.module.ts`, src, `utf8`);
}



function geraModule(schema) {
    const tableName = schema.name;
    let src = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ${util.primeiraMaiuscula(tableName)}RoutingModule } from './${tableName.toLocaleLowerCase()}-routing.module';
import { CrudComponent } from './crud/crud.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ListaComponent } from './lista/lista.component';

@NgModule({
  declarations: [CrudComponent, DetalhesComponent, ListaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ${util.primeiraMaiuscula(tableName)}RoutingModule
  ]
})
export class ${util.primeiraMaiuscula(tableName)}Module { }
`;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/${tableName.toLocaleLowerCase()}.module.ts`, src, `utf8`);
}


function geraCrudComponentTS(schema) {
    const tableName = schema.name;
    let src = `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/crud`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/crud/crud.component.ts`, src, `utf8`);
}

function geraCrudComponentHTML(schema) {
    const tableName = schema.name;
    let src = `
<h1>${util.primeiraMaiuscula(tableName)}</h1>
<router-outlet></router-outlet>

    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/crud`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/crud/crud.component.html`, src, `utf8`);
}
function geraCrudComponentCSS(schema) {
    const tableName = schema.name;
    let src = `


    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/crud`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/crud/crud.component.css`, src, `utf8`);
}

function geraListaComponentTS(schema) {
    const tableName = schema.name;
    let src = `
import { Component, OnInit } from '@angular/core';
import { ${util.primeiraMaiuscula(tableName)}Service } from '../${tableName.toLocaleLowerCase()}.service';
import { DFResponse } from 'src/app/dfresponse.type';
import { ${util.primeiraMaiuscula(tableName)} } from '../${tableName.toLocaleLowerCase()}.type';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SuperLista } from 'src/app/comum/super-lista';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent extends SuperLista<${util.primeiraMaiuscula(tableName)}> implements OnInit {


  constructor(service: ${util.primeiraMaiuscula(tableName)}Service, router: Router, route: ActivatedRoute) {
    super(service, router, route, "id");
  }

}

    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/lista`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/lista/lista.component.ts`, src, `utf8`);
}

function geraListaComponentHTML(schema) {
    const tableName = schema.name;
    let src = `
<div>
  <input type="text" id="inPesquisa" name="pesquisa" placeholder="Pesquisa" [(ngModel)]="queryString" />
  <button (click)="updateData()">Pesquisa</button>
</div>

<div>
  <table border="1">
    <thead>
      <tr>\n`;
    schema.field.forEach(f => {
        src += `        <th>${f.label}</th>\n`;
    });
    src += `</tr>
    </thead>
    <tbody *ngIf="data">
      <tr *ngFor="let d of data.resource">\n`;
    schema.field.forEach(f => {
        src += `        <td> {{d.${f.name}}}</td>\n`;
    });

    src += `        <td><button (click)="detail(d.id)">Edita</button></td>
      </tr>
    </tbody>
  </table>
</div>

<div>
  <p *ngIf="data?.meta?.count">{{offset+1}}--{{offset+data.resource.length}} / {{data.meta.count}}</p>
  <button *ngIf="offset>0" (click)="first()">First</button>
  <button *ngIf="data?.meta?.next" (click)="next()">Next</button>
  <button (click)="create()">Create</button>
</div>
    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/lista`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/lista/lista.component.html`, src, `utf8`);
}
function geraListaComponentCSS(schema) {
    const tableName = schema.name;
    let src = ``;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/lista`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/lista/lista.component.css`, src, `utf8`);
}



function geraDetalhesComponentTS(schema) {
    const tableName = schema.name;
    let src = `
import { Component, OnInit } from '@angular/core';
import { ${util.primeiraMaiuscula(tableName)}Service } from '../${tableName.toLocaleLowerCase()}.service';
import { DFResponse } from 'src/app/dfresponse.type';
import { ${util.primeiraMaiuscula(tableName)}  } from '../${tableName.toLocaleLowerCase()}.type';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SuperDetalhes } from 'src/app/comum/super-detalhes';
@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent extends SuperDetalhes<${util.primeiraMaiuscula(tableName)} > implements OnInit {

  constructor(service: ${util.primeiraMaiuscula(tableName)}Service, router: Router, route: ActivatedRoute) {
    super(service, router, route);
  }
}


    
    
    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/detalhes`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/detalhes/detalhes.component.ts`, src, `utf8`);
}

function geraDetalhesComponentHTML(schema) {
    const tableName = schema.name;
    let src = `
<div *ngIf="!selecionado">
  Carregando....
</div>
<div *ngIf="selecionado?.id">\n`;
    schema.field.forEach(f => {
        if (f.type == "string") {
            src += `${f.label}:<input type="text" name="${f.name}" [(ngModel)]="selecionado.${f.name}" />\n`;
        }
    });


    src += `  <button (click)="save()">Salvar</button>
  <button *ngIf="selecionado.id!='new'" (click)="delete()">Excluir</button>
</div>
<button (click)="cancel()">Cancelar</button>
    `;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/detalhes`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/detalhes/detalhes.component.html`, src, `utf8`);
}
function geraDetalhesComponentCSS(schema) {
    const tableName = schema.name;
    let src = ``;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}/detalhes`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/detalhes/detalhes.component.css`, src, `utf8`);
}


function gera(schema) {
    const tableName = schema.name;
    let src = ``;
    util.criaPasta(`generatedFiles/${tableName.toLocaleLowerCase()}`);
    util.escreveArquivo(`generatedFiles/${tableName.toLocaleLowerCase()}/${tableName.toLocaleLowerCase()}.ARG.ts`, src, `utf8`);
}

function geraCrud(schema) {
    geraService(schema);
    geraType(schema);
    geraModule(schema);
    geraRoutingModule(schema);
    geraCrudComponentTS(schema);
    geraCrudComponentHTML(schema);
    geraCrudComponentCSS(schema);
    geraListaComponentTS(schema);
    geraListaComponentHTML(schema);
    geraListaComponentCSS(schema);
    geraDetalhesComponentTS(schema);
    geraDetalhesComponentHTML(schema);
    geraDetalhesComponentCSS(schema);

}

request(`http://18.232.51.153/api/v2/pietra/_schema/LocalEvento?api_key=36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    geraCrud(body);
});