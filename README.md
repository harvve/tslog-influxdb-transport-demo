# tslog-influxdb-transport-demo
Demonstrates sending logs to InfluxDB2 via telegraph

## Prerequisites
Make sure you have installed [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) locally.

I refer to these articles (**choose right system version!**):
* [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
* [docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)


## Getting started

### Via Docker
The simplest and fastest solution is to run the demo in a docker environment to do this do the following:

```sh
docker-compose up -d
```

Go to page [http://localhost:8086/signin](http://localhost:8086/signin) and login to InfluxDB2:

```
Login: influxadminuser
Password: influxadminuserpassword
```

#### Vizualize logs
After logging in, you should see the main view

![InfluxDB home view][influxdb-home-view]

Click on **Build a Dashboard**

![InfluxDB dashboards view][influxdb-dashboards-view]

Then choose **Create Dashboard**

Change dashboard name to **Logs**

![InfluxDB logs view][influxdb-dashboards-logs-view]

Click on **Add cell**

![InfluxDB add cell][influxdb-add-cell-view]

On this view: 

1. Change cell name - click on `Name this cell` and type `exampleService1`
2. Click on `Script Editor` button and paste flux formula:
```
from(bucket: "harvve_demo_bucket")
  |> range(start: -2h)
  |> filter(fn: (r) => r["_measurement"] == "exampleService1Logs" and r._field == "logLevelId")
  |> window(every: 10s)
```
3. Select **Histogram** from view type selector
4. Click **Customize** button and change `Data` section
    - **X Column** - select `_time`
    - **Group by** - mark only `logLevel`
5. Click on **Submit** button
6. Save cell by clicking on check mark.

Then you shoud have one cell on your dashboard.

1. Click on **cell settings** and select **Clone**
2. Click on cloned cell settings and select **Configure**
3. On edit view change measurement container in **Script Editor** to `exampleService2Logs`:
```
from(bucket: "harvve_demo_bucket")
  |> range(start: -2h)
  |> filter(fn: (r) => r["_measurement"] == "exampleService2Logs" and r._field == "logLevelId")
  |> window(every: 10s)
```
4. Change name of cell to `exampleService2` and save

Then on the log dashboard you should have 2 cells.

![InfluxDB cell on dashboard][influxdb-cells-on-dashboard-view]


To set autorefresh click on `Enable Auto Refresh` and select:

![InfluxDB autorefresh dashboard cells][influxdb-autorefresh]

Confirm dialog.

Now, you should see logs from two services on your `Logs` dashboard.

> **Important!** The demo environment creates new logs all the time, remember to turn it off at the end of testing.

#### Clean up

```sh
docker-compose down -v
docker rmi harvve/tslog-influxdb-transport-demo
```

### Locally

If you want to start program via `ts-node-dev` first of all you need to create copy of `.env.default`:

```sh
cp .env.default .env
```

> **Make sure you have configured and running instance of `telegraf` and `influxdb2`**

Change `ADDRESS` and `PORT` in a copy of your `.env` file to direct to the running Telegraph instance. 

then you can run:

```sh
npm run debug
```

## License

Under the MIT License. See `LICENSE` for more information.

## Acknowledgments
* [@harvve/tslog-influxdb-transport](https://github.com/harvve/tslog-influxdb-transport)
* [tslog docs](https://tslog.js.org/#/)
* [InfluxDB2 docs](https://docs.influxdata.com/influxdb/v2.5/)
* [Telegraf docs](https://docs.influxdata.com/telegraf/v1.24/)
* [node.js dgram](https://nodejs.org/api/dgram.html#class-dgramsocket)


[influxdb-home-view]: img/Home-primary-InfluxDB.png
[influxdb-dashboards-view]: img/Dashboards-primary-InfluxDB.png
[influxdb-dashboards-logs-view]: img/Logs-primary-InfluxDB.png
[influxdb-add-cell-view]: img/Logs-new-cell-InfluxDB.png
[influxdb-autorefresh]: img/Logs-new-autorefresh-InfluxDB.png
[influxdb-cells-on-dashboard-view]: img/Logs-primary-end-InfluxDB.png
