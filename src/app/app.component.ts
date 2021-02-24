import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PathService } from './path/path.service';
import { Position } from './shared/interfaces/position.interface';
import * as Constants from './shared/constants';
import { GoogleMap } from '@angular/google-maps';
import { DialogComponent } from './shared/dialog/dialog.component';
import { PromptComponent } from './shared/prompt/prompt.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap

  private positions: Subscription;
  private postResponse: Subscription;

  showProgressBar: boolean = false;
  state = Constants.STATE.VIEW;
  title = 'draw-routes';
  zoom = 12;
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    maxZoom: 15
  }
  markers: Array<google.maps.Marker> = [];
  currentPath: google.maps.Polyline = null;

  constructor(private pathService: PathService,
              private snackBarCtrl: MatSnackBar,
              private dialogCtrl: MatDialog) {

    this.positions = this.pathService.updatedPositions.subscribe(
      (currentPositions: Array<Position>) => {
        currentPositions.forEach(positionElmnt => {
          this.addMarker(
            new google.maps.LatLng(
              positionElmnt.latitude,
              positionElmnt.longitude));
        });
        this.showProgressBar = false;
      }, error => {
        console.log('error SEARCHING', error.message);
        this.snackBarCtrl.open('Please, try again later', 'Dismiss');
        this.showProgressBar = false;
      }
    );
    this.postResponse = this.pathService.serverId.subscribe((response:boolean) => {
      if (response) {
        this.snackBarCtrl.open('The path was saved successfully', 'Accept');
        this.state = Constants.STATE.VIEW;
        this.deleteMarkers(true);
      } else {
        this.snackBarCtrl.open('Please, try again later', 'Dismiss');
      }
      this.showProgressBar = false;
    });
  }

  ngOnInit() {
    this.showProgressBar = true;
    navigator.geolocation.getCurrentPosition(postion => {
      this.center = {
        lat: postion.coords.latitude,
        lng: postion.coords.longitude
      };
      this.showProgressBar = false;
    });
  }

  ngOnDestroy() {
    this.positions.unsubscribe();
    this.postResponse.unsubscribe();
  }

  onClick(evt: google.maps.MapMouseEvent) {
    if (this.state == Constants.STATE.CREATE) {
      this.addMarker(evt.latLng);
    } else {
      this.dialogCtrl.open(DialogComponent, {
        data: {
          title: 'Information',
          message: 'If you desire to add new markers, just click the add button before to start',
          close: 'Accept'
        }
      });
    }
  }

  addMarker(position: google.maps.LatLng) {
    this.pathService.addNewPosition(position);
    this.markers.push( new google.maps.Marker({
      position: {
        lat: position.lat(),
        lng: position.lng()
      },
      label: {
        color: 'blue',
        text: 'Marker label'
      },
      title: 'Marker title',
      animation: google.maps.Animation.BOUNCE
    }));
  }

  createPath() {
    this.pathService.intializeNewPath();
    this.deleteMarkers(true);
    this.state = Constants.STATE.CREATE;
  }

  deleteMarkers(dontShowSnack?: boolean) {
    if (this.currentPath) { this.currentPath.setMap(null); }
    this.currentPath = null;
    this.markers = [];
    if (!dontShowSnack) { this.snackBarCtrl.open('Markers and Path were removed', 'Dismiss'); }
  }

  drawPath() {
    if (this.markers.length > 0) {
      this.currentPath = new google.maps.Polyline({
        path: this.markers.map(
          elmnt => { return {
            lat: elmnt.getPosition().lat(),
            lng: elmnt.getPosition().lng()
          }}),
        geodesic: true,
        strokeColor: "#33FFAC",
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentPath.setMap(this.map.googleMap);
    } else {
      this.dialogCtrl.open(DialogComponent, {
        data: {
          title: 'Validate',
          message: 'Before to draw a new path, you should to add some markers',
          close: 'Accept'
        }
      });
    }
  }

  savePath() {
    if (this.state == Constants.STATE.CREATE && this.markers.length > 0) {
      this.showProgressBar = true;
      this.pathService.postPositions();
    } else {
      this.dialogCtrl.open(DialogComponent, {
        data: {
          title: 'Validate',
          message: 'Before to save a new path, you should to add some markers',
          close: 'Accept'
        }
      });
    }
  }

  searchPath() {
    const prompt = this.dialogCtrl.open(PromptComponent);
    prompt.afterClosed().subscribe(result => {
      if (result) {
        this.showProgressBar = true;
        this.state = Constants.STATE.VIEW;
        this.deleteMarkers(true);
        this.pathService.getPath(result);
      } else {
        this.snackBarCtrl.open('You should type an ID', 'Dismiss');
      }
    });
    // 1614066736580;
  }

}
