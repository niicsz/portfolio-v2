import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { InterviewChatComponent } from './interview-chat/interview-chat.component';
import { LanguageService } from './i18n/language.service';

interface EducationItem {
  degree: 'mba' | 'technologist' | 'technical';
  school: string | null;
  logo: string;
  alt: string;
  start: [number, number?];
  end?: [number, number];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, InterviewChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private language = inject(LanguageService);
  readonly t = this.language.t;

  title = 'Nicolas Bezerra Bini - Portfolio';
  isDarkMode = true;
  isMenuOpen = false;

  skills = [
    { name: 'Java', icon: 'devicon-java-plain colored' },
    { name: 'Spring Boot', icon: 'devicon-spring-original colored' },
    { name: 'Hibernate', icon: 'devicon-hibernate-plain colored' },
    { name: 'Kafka', icon: 'devicon-apachekafka-original colored' },
    { name: 'RabbitMQ', icon: 'devicon-rabbitmq-original colored' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
    { name: 'Nest.js', icon: 'devicon-nestjs-original colored' },
    { name: 'Swagger', icon: 'devicon-swagger-plain colored' },
    { name: 'Angular', icon: 'devicon-angular-plain colored' },
    { name: 'Docker', icon: 'devicon-docker-plain colored' },
    { name: 'Podman', icon: 'devicon-podman-plain colored' },
    { name: 'Linux', icon: 'devicon-linux-plain colored' },
    { name: 'Bash', icon: 'devicon-bash-plain colored' },
    { name: 'Git', icon: 'devicon-git-plain colored' },
    { name: 'GitHub Actions', icon: 'devicon-githubactions-plain colored' },
    { name: 'Maven', icon: 'devicon-maven-plain colored' },
    { name: 'Azure', icon: 'devicon-azure-plain colored' },
    { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark colored' },
    { name: 'Terraform', icon: 'devicon-terraform-plain colored' },
    { name: 'SQL Server', icon: 'devicon-microsoftsqlserver-plain colored' },
    { name: 'MySQL', icon: 'devicon-mysql-original colored' },
    { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
    { name: 'Redis', icon: 'devicon-redis-plain colored' },
    { name: 'Cassandra', icon: 'devicon-cassandra-plain colored' },
    { name: 'Prometheus', icon: 'devicon-prometheus-original colored' },
    { name: 'Grafana', icon: 'devicon-grafana-plain colored' },
    { name: 'k6', icon: 'devicon-k6-original colored' }
  ];

  certifications = [
    { title: 'GH-300 Github Copilot', issuer: 'GitHub', year: 2026, month: 5, icon: 'assets/github.png' },
    { title: 'Bootcamp SRE Bronze', issuer: 'Bradesco', year: 2026, month: 5, icon: 'assets/sre-bronze.png' },
    { title: 'Red Hat Openshift Development I : Introduction to Containers with Podman', issuer: 'Red Hat', year: 2026, month: 3, icon: 'assets/red_hat.png' },
    { title: 'Red Hat Application Development I: Programming in Java EE', issuer: 'Red Hat', year: 2026, month: 3, icon: 'assets/red_hat.png' },
    { title: 'Batismo de Java', issuer: 'Java10x', year: 2026, month: 1, icon: 'devicon-java-plain colored' },
    { title: 'AZ-900 Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft', year: 2025, month: 6, icon: 'devicon-azure-plain colored' },
    { title: 'Databricks Fundamentals Accreditation', issuer: 'Databricks', year: 2025, month: 5, icon: 'fas fa-database' },
    { title: 'Formação Boas Práticas em Java', issuer: 'Alura', year: 2025, month: 6, icon: 'devicon-java-plain colored' },
    { title: 'Oracle Academy Java for AP Computer Science A', issuer: 'Oracle', year: 2024, month: 11, icon: 'devicon-java-plain colored' },
    { title: 'Java (Basic) Certificate', issuer: 'HackerRank', year: 2024, month: 10, icon: 'devicon-java-plain colored' },
    { title: 'Introdução ao Packet Tracer', issuer: 'Cisco', year: 2024, month: 8, icon: 'fas fa-network-wired' },
    { title: 'EF SET Certificate™ B2 Upper Intermediate English Level', issuer: 'EF SET', year: 2024, month: 8, icon: 'fas fa-language' },
    { title: 'Scrum Agilidade em seu projeto', issuer: 'Alura', year: 2024, month: 6, icon: 'fas fa-tasks' },
    { title: 'Java Programação Orientada a Objetos - 40 horas', issuer: 'Curso em Vídeo', year: 2024, month: 5, icon: 'devicon-java-plain colored' },
    { title: 'Fundamentos de TI: Hardware e Software', issuer: 'Fundação Bradesco', year: 2024, month: 5, icon: 'fas fa-desktop' },
    { title: 'Banco de Dados - Mysql - 40 Horas', issuer: 'Curso em Vídeo', year: 2024, month: 4, icon: 'devicon-mysql-plain colored' },
    { title: 'Gestão de Infraestrutura de TI', issuer: 'FIAP', year: 2023, month: 10, icon: 'fas fa-server' },
    { title: 'Privacidade e Proteção de Dados (LGPD)', issuer: 'Senai São Paulo', year: 2023, month: 3, icon: 'fas fa-user-shield' }
  ];

  projetos: { id: string; url: string; icon: string; inDevelopment?: boolean }[] = [
    { id: 'resilience-lab', url: 'https://github.com/niicsz/resilience-lab-hexagonal', icon: 'devicon-java-plain colored' },
    { id: 'binitech-pdv', url: 'https://github.com/niicsz/BiniTech-PDV', icon: 'devicon-java-plain colored' },
    { id: 'binitech-auth', url: 'https://github.com/niicsz/BiniTech-Auth', icon: 'devicon-java-plain colored' },
    { id: 'binitech-pdv-frontend', url: 'https://github.com/niicsz/BiniTech-PDV-frontend', icon: 'devicon-angular-plain colored' },
    { id: 'cep-api', url: 'https://github.com/niicsz/cep-api', icon: 'devicon-java-plain colored' },
    { id: 'url-shortener', url: 'https://github.com/niicsz/url-shortener', icon: 'devicon-java-plain colored' },
    { id: 'percentage-calculator', url: 'https://github.com/niicsz/Calculadora-de-Aumento-Percentual', icon: 'devicon-html5-plain colored' }
  ];

  education: EducationItem[] = [
    { degree: 'mba', school: null, logo: 'assets/logo-usp.svg', alt: 'USP Logo', start: [2026] },
    { degree: 'technologist', school: 'Universidade São Judas Tadeu', logo: 'assets/logo-usjt.svg', alt: 'USJT Logo', start: [2024, 2], end: [2026, 6] },
    { degree: 'technical', school: 'Fundação Instituto Tecnológico de Osasco', logo: 'assets/FundaçãoInstitutoTecnológicodeOsasco.png', alt: 'FITO Logo', start: [2020, 1], end: [2023, 12] }
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

  toggleLanguage() {
    this.language.toggle();
  }

  monthYear(year: number, month: number): string {
    return this.language.formatMonthYear(year, month);
  }

  educationPeriod(item: EducationItem): string {
    const [startYear, startMonth] = item.start;
    const start = startMonth ? this.monthYear(startYear, startMonth) : String(startYear);
    const end = item.end ? this.monthYear(item.end[0], item.end[1]) : this.t().education.inProgress;
    return `${start} - ${end}`;
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
