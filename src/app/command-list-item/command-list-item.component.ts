import { Component, OnInit } from '@angular/core';
import { MatSnackBar,MatCheckbox } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-command-list-item',
  templateUrl: './command-list-item.component.html',
  styleUrls: ['./command-list-item.component.scss']
})
export class CommandListItemComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { }
  public id: number; 
  commandUpdated() {
  	this.snackBar.open('Command updated', 'Dismiss', { duration: 2000 });
  }

  commandRemoved() {
  	this.snackBar.open('Command removed', 'Dismiss', { duration: 2000 });
    this.router.navigateByUrl("/commands");
  }

  ngOnInit() {
  	this.id = Number(+this.route.snapshot.params["id"]);
  }

}
