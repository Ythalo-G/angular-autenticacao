import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Lancamento } from '../models/lancamentos.model';
import { HttpService } from './http.service';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  lancamentos: any;

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  listarTodos(): Observable<any> {
    const id = this.httpService.obterIdUsuario();
    return this.http.get(
      env.apiBaseURL + 'api/lancamentos/funcionario/' + id,
      this.httpService.headers()
    );
  }

  downloadCSV(lancamentos: Lancamento[]) {
    const colunas = 'ID,Data,Hora,Tipo,Localização\n';
    const linhas: string[] = [];
    lancamentos.forEach(lanc => {
      const dataHora = lanc.data.split(' ');
      const linha = `${lanc.id},${dataHora[0]},${dataHora[1]},${lanc.tipo},"${lanc.localizacao}"`;
      linhas.push(linha);
    });
    const dados = colunas + linhas.join('\n');
    const blob = new Blob([dados], { type: 'text/csv' });
    saveAs(blob, 'lancamentos.csv');
  }

  downloadPDF(lancamentos: Lancamento[]){
     const colunas = ['ID', 'DATA', 'HORA', 'TIPO', 'LOCALIZACAO'];
     const linhas: string[][] = [];
     lancamentos.forEach(lanc => {
      const dataHora = lanc.data.split(' ');
      linhas.push([
        lanc.id.toString(),
        dataHora[0],
        dataHora[1],
        lanc.tipo,
        lanc.localizacao
      ]);
    });
    const data = new Date();
   // const doc = new jsPDF('l', 'mm', 'a1');--ALMENTAR A TABELAA
    const doc = new jsPDF();
    (doc as any).text(15,10, 'Listagem de lançamentos');
    (doc as any).setFontSize(10);
    (doc as any).text(170,10, data.toLocaleString('pt-BR'));
   
   
    (doc as any).autoTable({
      startY: 20,
      head: [colunas],
      body: linhas,
      foot:[colunas],
      theme:'grid' //mudar tema da tabela
    });
    
    
    doc.save('lancamentos' + data.toLocaleDateString('pt-BR') + '.pdf');
    //const nome = window.prompt();
    //doc.save(nome?.toString()); pede nome 
   
  }

}

