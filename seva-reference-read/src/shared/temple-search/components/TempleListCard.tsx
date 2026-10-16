import { Text } from "@/src/framework/components";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Badge from "./TempleBadge";

interface TempleListCardProps {
  templeName: string;
  templeImg: string | null;
  shrine: string;
  add1: string;
  add2: string;
  add3: string;
  post: string;
  isActive: boolean;
  onSelect: () => void;
}

const TempleListCard = ({
  
  templeName,
  templeImg,
  shrine,
  add1,
  add2,
  add3,
  post,
  isActive,
  onSelect,
}: TempleListCardProps) => {
  const [imageError, setImageError] = useState(false);

  const imageUri =
  templeImg &&
  typeof templeImg === "string" &&
  templeImg.trim().length > 0
    ? templeImg.startsWith("data:image")
      ? templeImg
      : `data:image/webp;base64,${templeImg}`
    : undefined;

    const imageSource =
  imageUri && !imageError
    ? { uri: imageUri }
    : require("../../../../assets/images/generic_image.webp");

  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >

      <View style={styles.imageContainer}>

       <Image
  source={imageSource}
  style={styles.templeImage}
  contentFit="cover"
  contentPosition="center"
  onError={() => {
    setImageError(true);
  }}
/>


        {/* Active Badge */}
        {isActive && (
          <View style={styles.activeBadgeContainer}>
            <Badge
              text="Active"
              icon="ellipse"
              variant="active"
            />
          </View>
        )}



        {/* Temple Details Badge */}
        <View style={styles.templeBadgeContainer}>

          <Badge>

            <View>

              {/* Temple Name */}
              <Text style={styles.templeNameText}
                 numberOfLines={1}
                 ellipsizeMode="tail">
                 
                {templeName}
              </Text>


              {/* Address Line 1 */}
              <Text style={styles.addressText}>
                {add1} {add2}
              </Text>


              {/* Address Line 2 */}
              <Text style={styles.addressText}>
                {add3} - {post}
              </Text>


            </View>

          </Badge>

        </View>



        {/* Shrine Badge */}
        <View style={styles.shrineBadgeContainer}>

          <Badge
            text={shrine}
            icon="sparkles"
          />

        </View>


      </View>


    </Pressable>
  );
};


export default TempleListCard;



const styles = StyleSheet.create({

  card: {
    width: "100%",
    backgroundColor:"#FFFFFF",

    borderRadius:24,

    marginBottom:18,

    overflow:"hidden",

    elevation:5,

    shadowColor:"#000",

    shadowOffset:{
      width:0,
      height:3,
    },

    shadowOpacity:0.14,

    shadowRadius:8,
  },


  imageContainer:{
    width:"100%",

    height:195,

    position:"relative",

    overflow:"hidden",
  },


  templeImage:{
    width:"100%",
    height:"100%",
  },


  imagePlaceholder:{
    backgroundColor:"#EAF4EC",
  },


  /* Temple Name + Address Badge */
  templeBadgeContainer:{
    position:"absolute",

    bottom:12,

    left:10,

    right:10,

    zIndex:20,

    elevation:20,
  },


  shrineBadgeContainer:{
    position:"absolute",

    top:8,

    right:8,

    zIndex:10,

    elevation:10,
  },


  activeBadgeContainer:{
    position:"absolute",

    top:8,

    left:8,

    zIndex:20,

    elevation:20,
  },


  templeNameText:{
    fontSize:12,

    fontFamily:"Roboto_700Bold",

    color:"#FFFFFF",

    lineHeight:20,
  },


  addressText:{
    fontSize:10,

    color:"#FFFFFF",

    lineHeight:16,

  },


  cardPressed:{
    opacity:0.8,
  },

});