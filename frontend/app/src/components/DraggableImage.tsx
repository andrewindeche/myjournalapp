import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  Text,
} from "react-native";

interface DraggableImageProps {
  uri: string;
  onPositionChange?: (y: number) => void;
  initialPosition?: number;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  uri,
  onPositionChange,
  initialPosition = 0,
}) => {
  const [position] = useState(new Animated.Value(initialPosition));
  const [height, setHeight] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      position.setOffset(position._value);
      position.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      const newY = Math.max(0, gestureState.dy);
      position.setValue(newY);
    },
    onPanResponderRelease: (_, gestureState) => {
      position.flattenOffset();
      if (onPositionChange) {
        onPositionChange(position._value);
      }
    },
  });

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dragIndicator}>
        <Text style={styles.dragText}>⋮⋮ Drag to move</Text>
      </View>
      <Animated.View
        style={[styles.imageWrapper, { transform: [{ translateY: position }] }]}
        {...panResponder.panHandlers}
        onLayout={onLayout}
      >
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  dragIndicator: {
    alignItems: "center",
    paddingVertical: 4,
  },
  dragText: {
    color: "#888",
    fontSize: 12,
  },
  image: {
    borderRadius: 8,
    height: 150,
    width: "100%",
  },
  imageWrapper: {
    width: "100%",
  },
});

export default DraggableImage;
