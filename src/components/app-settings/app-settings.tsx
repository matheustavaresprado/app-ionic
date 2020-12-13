import { Component, State, h } from '@stencil/core';
import { SettingsData } from "../../services/settings-data";

@Component({
  tag: 'app-settings',
  styleUrl: 'app-settings.css',
  shadow: true,
})
export class AppSettings {

  @State() useCurrentLocation: boolean = true;
  @State() presetLocation: string = "Rio de Janeiro";
  @State() unit: string = "celsius";

  async componentWillLoad() {
    let [location, unit] = await Promise.all([
      SettingsData.getLocation(),
      SettingsData.getTemperatureUnit()
    ]);
    this.useCurrentLocation = location.useCoords;
    this.presetLocation = location.name;
    this.unit = unit;
  }

  async handleToggleLocation(value) {
    if (value === "current") {
      this.useCurrentLocation = true;
    } else {
      this.useCurrentLocation = false;
    }
    await SettingsData.setUseCoords(this.useCurrentLocation);
  }

  async handleLocationChange(location) {
    this.presetLocation = location;
    await SettingsData.setLocationName(location);
  }

  async handleUnitChange(unit) {
    this.unit = unit;
    await SettingsData.setTemperatureUnit(unit);
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/" />
          </ion-buttons>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content class="ion-padding">
        <div class="settings-display">
          <small>
            You may choose to display weather either from your current location, or a preset location of your choosing.
        </small>
          <ion-radio-group
            value={this.useCurrentLocation ? "current" : "present"}
            onIonChange={ev => {
              this.handleToggleLocation(ev.detail.value);
            }}>
            <ion-item>
              <ion-label>Use current location</ion-label>
              <ion-radio value="current" slot="start" />
            </ion-item>
            <ion-item>
              <ion-label>Use present location</ion-label>
              <ion-radio value="present" slot="start" />
            </ion-item>
          </ion-radio-group>

          <small>
            When using a preset location, the location listed below will be used.
        </small>
          <ion-item>
            <ion-input
              value={this.presetLocation}
              type="text"
              onIonInput={(ev: any) => {
                this.handleLocationChange(ev.target.value);
              }}
            />
          </ion-item>
          <small>
            Select the unit of measurement that you would like to use to display the weather:
        </small>
          <ion-radio-group value={this.unit}
            onIonChange={ev => {
              this.handleUnitChange(ev.detail.value);
            }}>
            <ion-item>
              <ion-label>Celsius</ion-label>
              <ion-radio value="celsius" slot="start" />
            </ion-item>
            <ion-item>

              <ion-label>Fahrenheit</ion-label>
              <ion-radio value="fahrenheit" slot="start" />
            </ion-item>
            <ion-item>
              <ion-label>Kelvin</ion-label>
              <ion-radio value="kelvin" slot="start" />
            </ion-item>
          </ion-radio-group>
          <small hidden={this.unit != "kelvin"}>
            Kelvin? Seriously?
        </small>
        </div>
      </ion-content>
    ];
  }


}
