import {
  animate, state, style, transition, trigger
} from '@angular/animations';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { TREE_DATA } from './sidenav-datasource';
import { MenuItemFlatNode, MenuItemNode } from './sidenav-tree.enum';

@Component({
  selector: 'anp-sidenav-tree',
  templateUrl: './sidenav-tree.component.html',
  styleUrls: ['./sidenav-tree.component.scss'],
  animations: [
    trigger('expandNode', [
      transition(':enter', [
        style({ opacity: 0, height: 0, 'min-height': 0 }),
        animate('150ms', style({ opacity: 1, height: '*', 'min-height': '*' })),
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0, height: 0, 'min-height': '0px' }))
      ])
    ]),
    trigger('expandArrow', [
      state('close', style({ transform: 'rotate(0)' })),
      state('expand', style({ transform: 'rotate(90deg)' })),
      transition('* => *', [animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)')])
    ])
  ]
})
export class SidenavTreeComponent {
  @Output() menuItemChosen = new EventEmitter<void>();

  public treeControl = new FlatTreeControl<MenuItemFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  public dataSource: MatTreeFlatDataSource<MenuItemNode, MenuItemFlatNode>;

  private transformer = (node: MenuItemNode, level: number) => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    path: node.path || null,
    level,
  });

  private treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  constructor() {
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = TREE_DATA;
  }

  public hasChild = (_: number, node: MenuItemFlatNode) => node.expandable;

  public itemChosen(): void {
    this.menuItemChosen.emit();
  }
}
