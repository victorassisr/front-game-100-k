import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavingsService, SavingsResponse, NumberEntry } from '../../services/savings.service';

@Component({
  selector: 'app-savings-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './savings-dashboard.component.html',
  styleUrls: ['./savings-dashboard.component.scss']
})
export class SavingsDashboardComponent implements OnInit {
  data: SavingsResponse | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private savingsService: SavingsService,
    private cdr: ChangeDetectorRef // 1. Injeta o detector de mudanças
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.savingsService.getData().subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
        this.cdr.detectChanges(); // 2. Força o Angular a renderizar a tela agora!
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar dados da API. O servidor está rodando?';
        this.loading = false;
        this.cdr.detectChanges(); // 3. Garante que o erro apareça na tela
        console.error(err);
      }
    });
  }

  toggleNumber(entry: NumberEntry): void {
    const originalState = entry.checked;
    entry.checked = !originalState;
    this.updateMetricsLocally();
    this.cdr.detectChanges(); // Atualiza a tela instantaneamente no clique

    this.savingsService.updateStatus(entry.number, entry.checked).subscribe({
      error: () => {
        entry.checked = originalState;
        this.updateMetricsLocally();
        this.cdr.detectChanges();
        alert('Falha ao atualizar o status no servidor.');
      }
    });
  }

  updateMetricsLocally(): void {
    if (!this.data) return;
    const completed = this.data.entries.filter(e => e.checked);
    const totalSaved = completed.reduce((acc, curr) => acc + curr.number, 0);

    this.data.metrics.completedCount = completed.length;
    this.data.metrics.remainingCount = this.data.entries.length - completed.length;
    this.data.metrics.totalSaved = totalSaved;
    this.data.metrics.progressPercentage = Number(((totalSaved / this.data.metrics.targetTotal) * 100).toFixed(2));
  }

  resetChallenge(): void {
    if (confirm('Tem certeza que deseja zerar todo o progresso do desafio?')) {
      this.savingsService.resetAll().subscribe({
        next: () => this.loadData(),
        error: () => alert('Erro ao resetar o desafio.')
      });
    }
  }
}