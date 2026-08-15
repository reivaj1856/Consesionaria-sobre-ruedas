import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  standalone: true,
  template: `
    <div class="py-12 flex justify-center">
      <span class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
    </div>
  `
})
export class PlansComponent implements OnInit {
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.router.navigate(['/']);
  }
}
