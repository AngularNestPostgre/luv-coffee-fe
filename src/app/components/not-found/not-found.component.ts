import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'anp-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public url!: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.url = this.router.url;
  }
}
