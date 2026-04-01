import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  title = 'Nicolas Bezerra Bini - Portfolio';
  isDarkMode = true;
  isMenuOpen = false;

  skills = [
    { name: 'Java', icon: 'devicon-java-plain colored' },
    { name: 'Spring Boot', icon: 'devicon-spring-original colored' },
    { name: 'Kafka', icon: 'devicon-apachekafka-original colored' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
    { name: 'Nest.js', icon: 'devicon-nestjs-original colored' },
    { name: 'Angular', icon: 'devicon-angularjs-plain colored' },
    { name: 'Docker', icon: 'devicon-docker-plain colored' },
    { name: 'SQL Server', icon: 'devicon-microsoftsqlserver-plain colored' },
    { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
    { name: 'Azure', icon: 'devicon-azure-plain colored' },
    { name: 'Backstage', icon: 'assets/backstage-icon.svg' }
  ];

  certifications = [
    { title: 'Red Hat Openshift Development I : Introduction to Containers with Podman', issuer: 'Red Hat', date: 'Mar 2026', icon: 'devicon-redhat-plain colored' },
    { title: 'Red Hat Application Development I: Programming in Java EE', issuer: 'Red Hat', date: 'Mar 2026', icon: 'devicon-redhat-plain colored' },
    { title: 'Batismo de Java', issuer: 'Java10x', date: 'Jan 2026', icon: 'devicon-java-plain colored' },
    { title: 'AZ-900 Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft', date: 'Jun 2025', icon: 'devicon-azure-plain colored' },
    { title: 'Databricks Fundamentals Accreditation', issuer: 'Databricks', date: 'Mai 2025', icon: 'fas fa-database' },
    { title: 'Formação Boas Práticas em Java', issuer: 'Alura', date: 'Jun 2025', icon: 'devicon-java-plain colored' },
    { title: 'Oracle Academy Java for AP Computer Science A', issuer: 'Oracle', date: 'Nov 2024', icon: 'devicon-java-plain colored' },
    { title: 'Java (Basic) Certificate', issuer: 'HackerRank', date: 'Out 2024', icon: 'devicon-java-plain colored' },
    { title: 'Introdução ao Packet Tracer', issuer: 'Cisco', date: 'Ago 2024', icon: 'fas fa-network-wired' },
    { title: 'EF SET Certificate™ B2 Upper Intermediate English Level', issuer: 'EF SET', date: 'Ago 2024', icon: 'fas fa-language' },
    { title: 'Scrum Agilidade em seu projeto', issuer: 'Alura', date: 'Jun 2024', icon: 'fas fa-tasks' },
    { title: 'Java Programação Orientada a Objetos - 40 horas', issuer: 'Curso em Vídeo', date: 'Mai 2024', icon: 'devicon-java-plain colored' },
    { title: 'Fundamentos de TI: Hardware e Software', issuer: 'Fundação Bradesco', date: 'Mai 2024', icon: 'fas fa-desktop' },
    { title: 'Banco de Dados - Mysql - 40 Horas', issuer: 'Curso em Vídeo', date: 'Abr 2024', icon: 'devicon-mysql-plain colored' },
    { title: 'Gestão de Infraestrutura de TI', issuer: 'FIAP', date: 'Out 2023', icon: 'fas fa-server' },
    { title: 'Privacidade e Proteção de Dados (LGPD)', issuer: 'Senai São Paulo', date: 'Mar 2023', icon: 'fas fa-user-shield' }
  ];

  projetos = [
    { name: 'BiniTech PDV', description: 'Sistema de Ponto de Venda (PDV) moderno e eficiente, focado na gestão de caixa.', url: 'https://github.com/niicsz/BiniTech-PDV', icon: 'devicon-java-plain colored' },
    { name: 'Clínica Médica App', description: 'Sistema de gestão para clínica médica, com cadastro de usuários, pacientes, médicos e agendamento de consultas.', url: 'https://github.com/niicsz/clinica-medica', icon: 'devicon-java-plain colored', inDevelopment: true },
    { name: 'Locadora Hexagonal & HMAC', description: 'Sistema de locadora de carros aplicando arquitetura hexagonal e HMAC para segurança e integridade das requisições.', url: 'https://github.com/niicsz/locadora-hex-hmac', icon: 'devicon-java-plain colored', inDevelopment: true },
    { name: 'URL Shortener', description: 'Encurtador de URLs rápido e escalável construído com Java e banco de dados relacional.', url: 'https://github.com/niicsz/url-shortener', icon: 'devicon-java-plain colored', inDevelopment: true },
    { name: 'App Inspirado no Linktree', description: 'Aplicação inspirada no Linktree, permitindo centralizar links em uma página personalizada e de fácil acesso.', url: 'https://github.com/niicsz/App-Inspirado-Linktree', icon: 'devicon-css3-plain colored' },
    { name: 'Calculadora de Aumento Percentual', description: 'Projeto de calculadora que aplica aumento percentual a um valor inicial.', url: 'https://github.com/niicsz/Calculadora-de-Aumento-Percentual', icon: 'devicon-html5-plain colored' }
  ];

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.updateTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
    this.cdr.markForCheck();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.cdr.markForCheck();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.cdr.markForCheck();
  }

  updateTheme() {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}
