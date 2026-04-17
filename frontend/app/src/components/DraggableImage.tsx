import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  Text,
  Pressable,
} from "react-native";
import { Colors } from "../colors";

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
  const position = useRef(new Animated.Value(initialPosition)).current;
  const [isResetVisible, setIsResetVisible] = useState(false);
  const offsetRef = useRef(0);
  const valueRef = useRef(initialPosition);
  const heightRef = useRef(0);

  useEffect(() => {
    const listener = position.addListener(({ value }) => {
      valueRef.current = value;
    });
    return () => {
      position.removeListener(listener);
    };
  }, [position]);

  const handlePanResponderGrant = useCallback(() => {
    offsetRef.current = valueRef.current;
    position.setOffset(valueRef.current);
    position.setValue(0);
  }, [position]);

  const handlePanResponderMove = useCallback(
    (_: typeof PanResponder, gestureState: { dy: number }) => {
      position.setValue(gestureState.dy);
    },
    [position],
  );

  const handlePanResponderRelease = useCallback(() => {
    position.flattenOffset();
    const currentY = valueRef.current;
    setIsResetVisible(Math.abs(currentY) > 10);
    valueRef.current = 0;
    offsetRef.current = 0;
    if (onPositionChange) {
      onPositionChange(currentY);
    }
  }, [position, onPositionChange]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handlePanResponderGrant,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderRelease,
    }),
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    heightRef.current = event.nativeEvent.layout.height;
  };

  const handleReset = () => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    valueRef.current = 0;
    offsetRef.current = 0;
    setIsResetVisible(false);
    if (onPositionChange) {
      onPositionChange(0);
    }
  };

  return (
    <View style={styles.container}>
      {isResetVisible && (
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset Position</Text>
        </Pressable>
      )}
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
    color: Colors.dimGray,
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
  resetButton: {
    alignItems: "center",
    backgroundColor: Colors.darkGray,
    borderRadius: 5,
    marginBottom: 5,
    padding: 8,
  },
  resetText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default DraggableImage;
