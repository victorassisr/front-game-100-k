import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  txtToggleSenha = 'Mostrar Senha';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
) {}

  onLogin() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Usuário ou senha inválidos.';
        this.loading = false;
        this.cdr.detectChanges(); // Atualiza a tela para mostrar a mensagem de erro
      }
    });
  }

  togglePasswordVisibility() {
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    if (passwordInput) {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
      this.txtToggleSenha = passwordInput.type === 'password' ? 'Mostrar Senha' : 'Ocultar Senha';
    }
  }
}