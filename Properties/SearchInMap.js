import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "@react-navigation/compat";
import MapView, { Marker, Circle, Callout } from "react-native-maps";
import {
  scale,
  verticalScale,
  fontScale,
  imageScale,
} from "../../util/scaling";
import { formatPrice } from "../../util/helper";
import {
  updateLatLng,
  searchProperties,
  searchPropertiesInMap,
} from "../../redux/actions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Geolocation from "react-native-geolocation-service";
import { Svg, Image as ImageSvg } from "react-native-svg";

const share = require("../icons/properties/share.png");
const markerImage = require("../icons/properties/location.png");
const locationIcon = require("../icons/properties/blurlocation.png");
const minusIcon = require("../icons/properties/minus.png");
const plusIcon = require("../icons/properties/plus.png");

const styles = StyleSheet.create({
  gmapView: {
    flex: 1,
    height: verticalScale(491),
    width: scale(375),
  },
  propImage: {
    height: verticalScale(220),
    width: scale(340),
  },
  marker: {
    backgroundColor: "rgb(42, 50, 119)",
    height: verticalScale(26.5),
    borderRadius: verticalScale(5),
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontFamily: "Roboto-Regular",
    fontSize: fontScale(13),
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(7),
  },
  filterPicker: {
    position: "absolute",
    bottom: verticalScale(30),
    right: scale(10),
  },
  cardBorder: {
    borderRadius: scale(2.5),
    height: verticalScale(220),
    width: scale(320),
  },
  proImage: {
    width: scale(320),
    height: verticalScale(134),
  },
  detailsView: {
    marginLeft: scale(11),
  },
  mlsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: verticalScale(30),
  },
  mlsId: {
    fontFamily: "Roboto-Regular",
    fontSize: fontScale(12.1),
    color: "rgb(1, 1, 1)",
    marginTop: verticalScale(3),
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: verticalScale(8),
  },
  hmsIcons: {
    width: scale(35),
    height: verticalScale(30),
  },
  doller: {
    fontFamily: "Roboto-Medium",
    fontSize: fontScale(19.8),
    color: "rgb(0, 0, 0)",
    width: scale(184),
    height: verticalScale(26),
    marginTop: -verticalScale(7),
  },
  locationView: {
    flexDirection: "row",
    height: verticalScale(15),
    marginTop: verticalScale(7.5),
    alignItems: "center",
  },
  locTest: {
    fontFamily: "Roboto-Regular",
    fontSize: fontScale(11),
    color: "rgb(57, 55, 55)",
    marginLeft: scale(7),
    opacity: 0.5,
  },
  incdecRadius: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    top: verticalScale(395),
    backgroundColor: "rgb(255, 255, 255)",
    padding: 10,
    borderRadius: scale(17.5),
  },
  rightdecRadius: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    top: verticalScale(420),
    right: 20,
    backgroundColor: "rgb(255, 255, 255)",
    padding: 10,
    borderRadius: scale(17.5),
  },
  minusbuttonView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(216, 216, 216)",
    height: imageScale(25),
    width: imageScale(25),
    borderRadius: scale(40),
    right: scale(6),
  },
  plusbuttonView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(216, 216, 216)",
    height: imageScale(25),
    width: imageScale(25),
    borderRadius: scale(40),
    left: scale(5),
  },
  locationbuttonView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: imageScale(25),
    width: imageScale(25),
    borderRadius: scale(40),
  },
  radiusTextView: {
    height: verticalScale(17),
    alignSelf: "center",
  },
  radiusText: {
    fontFamily: "Roboto-Regular",
    fontSize: fontScale(13),
    alignSelf: "center",
    color: "rgb(51,51,51)",
  },
  searchThisArea: {
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(8),
    backgroundColor: "#fff",
    position: "absolute",
    zIndex: 5,
    top: verticalScale(5),
    alignSelf: "center",
  },
  searchThisAreaText: {
    fontFamily: "Roboto-Regular",
    fontSize: fontScale(13),
    fontWeight: "400",
    color: "#3C84F4",
  },
});

class SearchInMap extends React.Component {
  static navigationOptions = {
    tabBarVisible: false,
    header: null,
  };

  constructor(props) {
    super(props);
    const {
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      ageOfHouse,
      priceRange,
      noOfBedSelected,
      lotTotalSqft,
      livingSqft,
      distance,
      noOfBathSelected,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
    } = props.placesAutoCompleteReducer.filterParameters;
    this.state = {
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      priceRange,
      ageOfHouse,
      noOfBedSelected,
      noOfBathSelected,
      lotTotalSqft,
      livingSqft,
      distance,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
      newLatitude: props.placesAutoCompleteReducer.latlong.lat,
      newLongitude: props.placesAutoCompleteReducer.latlong.lng,
      count: props.placesAutoCompleteReducer.filterParameters.distance[1],
      radius:
        1609.34 * props.placesAutoCompleteReducer.filterParameters.distance[1],
      pageNo: 1,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(
      "componentWillReceiveProps ====> " + JSON.stringify(nextProps.properties)
    );
  };

  componentDidMount() {
    const {
      zip,
      city,
      latlong,
      address,
    } = this.props.placesAutoCompleteReducer;
    const {
      priceRange,
      ageOfHouse,
      noOfBedSelected,
      noOfBathSelected,
      propertyTypeSelected,
      dwellingTypeSelected,
      propertyStatusSelected,
      lotTotalSqft,
      livingSqft,
      distance,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
    } = this.state;
    console.log(
      "from SearchInMap ====> " + JSON.stringify(global.fromNavigate)
    );
    this.props.searchPropertiesInMap({
      zip,
      city,
      latlong,
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      priceRange,
      ageOfHouse,
      noOfBedSelected,
      noOfBathSelected,
      lotTotalSqft,
      livingSqft,
      distance,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
      page: 1,
    });
  }

  getCurrentPosition = async () => {
    await Geolocation.getCurrentPosition(
      ({ coords }) => {
        if (this.mapView) {
          console.log("curent location: ", coords);
          // this.onPressSearchThisArea()
          this.mapView.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.4,
            longitudeDelta: 0.4,
          });

          this.onPressSearchCurrentArea(coords.latitude, coords.longitude);
        }
      },
      (error) => alert("Error: Are location services on?"),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000,
        distanceFilter: 1,
      }
    );
  };

  onPressSearchCurrentArea = (newLatitude, newLongitude) => {
    this.props.updateLatLng({ lat: newLatitude, lng: newLongitude });
    const { zip, city } = this.props.placesAutoCompleteReducer;
    const {
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      ageOfHouse,
      priceRange,
      noOfBedSelected,
      lotTotalSqft,
      livingSqft,
      noOfBathSelected,
      distance,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
    } = this.props.placesAutoCompleteReducer.filterParameters;
    this.props.searchPropertiesInMap({
      zip,
      city,
      latlong: { lat: newLatitude, lng: newLongitude },
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      priceRange,
      ageOfHouse,
      noOfBedSelected,
      noOfBathSelected,
      lotTotalSqft,
      livingSqft,
      distance,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
      page: 1,
    });
  };

  render() {
    const { currentLocation, latlong } = this.props.placesAutoCompleteReducer;
    const {
      cardBorder,
      proImage,
      mlsView,
      mlsId,
      hmsIcons,
      doller,
      detailsView,
      locationView,
      locTest,
    } = styles;

    return (
      <View>
        {this.state.newLatitude && (
          <TouchableOpacity
            onPress={() => this.onPressSearchThisArea()}
            style={styles.searchThisArea}
          >
            <Text style={styles.searchThisAreaText}>SEARCH THIS AREA</Text>
          </TouchableOpacity>
        )}
        <MapView
          style={styles.gmapView}
          showsUserLocation
          ref={(ref) => (this.mapView = ref)}
          followUserLocation
          showsMyLocationButton
          minZoomLevel={Platform.OS == "ios" ? 11 : 12}
          initialRegion={{
            latitude: latlong.lat || currentLocation.latitude,
            longitude: latlong.lng || currentLocation.longitude,
            latitudeDelta: 0.4,
            longitudeDelta: 0.4,
          }}
          onRegionChange={(data) =>
            this.setState({
              newLatitude: data.latitude,
              newLongitude: data.longitude,
            })
          }
        >
          <Marker
            coordinate={{
              latitude: this.props.placesAutoCompleteReducer.latlong.lat,
              longitude: this.props.placesAutoCompleteReducer.latlong.lng,
            }}
          >
            <Image
              resizeMode="contain"
              source={markerImage}
              style={{ width: scale(30), height: verticalScale(40) }}
            />
          </Marker>
          {this.props.properties.listingsInMap.map((property) => {
            return (
              <Marker
                key={property.id}
                coordinate={{
                  latitude: property.GeoLatitude,
                  longitude: property.GeoLongitude,
                }}
              >
                <View style={styles.marker}>
                  <Text style={styles.text}>
                    {formatPrice(property.ListPrice)}
                  </Text>
                </View>
                <Callout
                  onPress={() =>
                    this.props.navigation.navigate("PropertyDetails", {
                      propertyId: property.id,
                    })
                  }
                >
                  <View style={cardBorder}>
                    <View style={{ width: scale(320) }}>
                      {Platform.OS === "android" ? (
                        <Svg
                          style={{
                            width: scale(320),
                            height: scale(170),
                            position: "relative",
                            bottom: 10,
                          }}
                        >
                          <ImageSvg
                            width={"100%"}
                            height={"100%"}
                            preserveAspectRatio="xMidYMid slice"
                            href={{
                              uri:
                                property.photo_url.length > 0
                                  ? property.photo_url[0].Uri640
                                  : "https://www.enlighttechnologies.in/images/projects/lg/photo_not_available.png",
                            }}
                          />
                        </Svg>
                      ) : (
                        <Image
                          resizeMode="cover"
                          style={proImage}
                          source={{
                            uri:
                              property.photo_url.length > 0
                                ? property.photo_url[0].Uri640
                                : "https://www.enlighttechnologies.in/images/projects/lg/photo_not_available.png",
                          }}
                        />
                      )}

                      <View style={detailsView}>
                        <View style={mlsView}>
                          <Text style={mlsId}>
                            MLS ID : {property.ListNumber}
                          </Text>
                          <View style={styles.actionIcons}>
                            <TouchableOpacity
                              style={hmsIcons}
                              onPress={() =>
                                Share.share({
                                  message: "MLS URL showing property details",
                                })
                              }
                            >
                              <Image
                                resizeMode="cover"
                                source={share}
                                style={{
                                  width: scale(16.5),
                                  height: verticalScale(18.1),
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={doller}>
                            {formatPrice(property.ListPrice)}
                          </Text>
                        </View>
                        <View style={locationView}>
                          <Image
                            resizeMode="cover"
                            source={locationIcon}
                            style={{
                              height: verticalScale(14),
                              width: scale(13),
                            }}
                          />
                          <Text style={locTest}>{property.Address}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}
          <Circle
            center={{
              latitude: latlong.lat || currentLocation.latitude,
              longitude: latlong.lng || currentLocation.longitude,
            }}
            radius={this.state.radius}
            fillColor="rgba(214, 214, 245,0.6)"
            strokeColor="#000000"
            zIndex={1}
            strokeWidth={1}
          />
        </MapView>
        <View style={styles.rightdecRadius}>
          <TouchableOpacity
            style={styles.locationbuttonView}
            onPress={() => this.getCurrentPosition()}
          >
            <MaterialIcons name="my-location" size={30} />
          </TouchableOpacity>
        </View>
        {global.fromNavigate != "ClosestHome" && (
          <View style={styles.incdecRadius}>
            {this.state.count > 1 ? (
              <TouchableOpacity
                onPress={() => this.decreaseRadius()}
                style={styles.minusbuttonView}
              >
                <Image
                  resizeMode="contain"
                  source={minusIcon}
                  style={{
                    width: scale(9),
                    height: verticalScale(1.4),
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled style={styles.minusbuttonView}>
                <Image
                  resizeMode="contain"
                  source={minusIcon}
                  style={{
                    width: scale(9),
                    height: verticalScale(1.4),
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            )}
            <View style={styles.radiusTextView}>
              <Text style={styles.radiusText}>
                {this.state.count} miles radius
              </Text>
            </View>
            {this.state.count < 30 ? (
              <TouchableOpacity
                onPress={() => this.increaseRadius()}
                style={styles.plusbuttonView}
              >
                <Image
                  resizeMode="contain"
                  source={plusIcon}
                  style={{
                    width: scale(9),
                    height: verticalScale(9),
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled style={styles.plusbuttonView}>
                <Image
                  resizeMode="contain"
                  source={plusIcon}
                  style={{
                    width: scale(9),
                    height: verticalScale(9),
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }

  onPressSearchThisArea = () => {
    this.props.updateLatLng({
      lat: this.state.newLatitude,
      lng: this.state.newLongitude,
    });
    const { zip, city } = this.props.placesAutoCompleteReducer;
    const {
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      ageOfHouse,
      priceRange,
      noOfBedSelected,
      lotTotalSqft,
      livingSqft,
      noOfBathSelected,
      distance,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
    } = this.props.placesAutoCompleteReducer.filterParameters;
    this.props.searchPropertiesInMap({
      zip,
      city,
      latlong: { lat: this.state.newLatitude, lng: this.state.newLongitude },
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      priceRange,
      ageOfHouse,
      noOfBedSelected,
      noOfBathSelected,
      lotTotalSqft,
      livingSqft,
      distance,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
      page: 1,
    });
  };

  increaseRadius = () => {
    this.setState({ radius: this.state.radius + 1609.34 });
    const { zip, city } = this.props.placesAutoCompleteReducer;
    const {
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      ageOfHouse,
      priceRange,
      noOfBedSelected,
      lotTotalSqft,
      livingSqft,
      noOfBathSelected,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
    } = this.props.placesAutoCompleteReducer.filterParameters;
    this.setState(
      { count: this.state.count + 1, pageNo: this.state.pageNo + 1 },
      () =>
        this.props.searchPropertiesInMap({
          zip,
          city,
          latlong: {
            lat: this.state.newLatitude,
            lng: this.state.newLongitude,
          },
          propertyTypeSelected,
          propertyStatusSelected,
          dwellingTypeSelected,
          priceRange,
          ageOfHouse,
          noOfBedSelected,
          noOfBathSelected,
          lotTotalSqft,
          livingSqft,
          distance: [0, this.state.count],
          swimmingPoolTypeSelected,
          parkingFeaturesSelected,
          specialListingCondSelected,
          garageSpace,
          interiorLevel,
          page: this.state.pageNo,
          appendList: true,
        })
    );
  };

  decreaseRadius = () => {
    this.setState({ radius: this.state.radius - 1609.34 });
    const { zip, city } = this.props.placesAutoCompleteReducer;
    const {
      propertyTypeSelected,
      propertyStatusSelected,
      dwellingTypeSelected,
      ageOfHouse,
      priceRange,
      noOfBedSelected,
      lotTotalSqft,
      livingSqft,
      noOfBathSelected,
      swimmingPoolTypeSelected,
      parkingFeaturesSelected,
      specialListingCondSelected,
      garageSpace,
      interiorLevel,
    } = this.props.placesAutoCompleteReducer.filterParameters;
    this.setState(
      { count: this.state.count - 1, pageNo: this.state.pageNo - 1 },
      () =>
        this.props.searchPropertiesInMap({
          zip,
          city,
          latlong: {
            lat: this.state.newLatitude,
            lng: this.state.newLongitude,
          },
          propertyTypeSelected,
          propertyStatusSelected,
          dwellingTypeSelected,
          priceRange,
          ageOfHouse,
          noOfBedSelected,
          noOfBathSelected,
          lotTotalSqft,
          livingSqft,
          distance: [0, this.state.count],
          swimmingPoolTypeSelected,
          parkingFeaturesSelected,
          specialListingCondSelected,
          garageSpace,
          interiorLevel,
          page: this.state.pageNo,
        })
    );
  };
}

const mapStateToProps = (state) => {
  const { properties, placesAutoCompleteReducer } = state;
  return { properties, placesAutoCompleteReducer };
};

export default connect(mapStateToProps, {
  updateLatLng,
  searchProperties,
  searchPropertiesInMap,
})(withNavigation(SearchInMap));
