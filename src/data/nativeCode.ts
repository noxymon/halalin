// React Native + Expo complete codebase definition for developer inspection and copying.
// This matches the exact visual structure, state flow, and safety features of HalalVerify.

export interface NativeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const REACT_NATIVE_FILES: NativeFile[] = [
  {
    path: "App.tsx",
    name: "App.tsx",
    language: "typescript",
    content: `import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShieldCheck, Database, Settings as SettingsIcon } from 'lucide-react-native';

// Import screens (defined below)
import ScannerScreen from './screens/ScannerScreen';
import ResultsScreen from './screens/ResultsScreen';
import BrandDirectoryScreen from './screens/BrandDirectoryScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'ScannerTab') {
            return <ShieldCheck size={size} color={color} />;
          } else if (route.name === 'Directory') {
            return <Database size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <SettingsIcon size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="ScannerTab" 
        component={ScannerScreen} 
        options={{ title: 'Scanner' }} 
      />
      <Tab.Screen 
        name="Directory" 
        component={BrandDirectoryScreen} 
        options={{ title: 'JHA Directory' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'API Settings' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Results" component={ResultsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}`
  },
  {
    path: "screens/ScannerScreen.tsx",
    name: "ScannerScreen.tsx",
    language: "typescript",
    content: `import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image, 
  Alert,
  ScrollView
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera as CameraIcon, Upload, Sparkles, Image as ImageIcon } from 'lucide-react-native';
import { analyzeHalalIngredients } from '../services/gemini';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.buttonGreen} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      triggerAnalysis(result.assets[0].uri);
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        setIsCameraActive(false);
        triggerAnalysis(photo.uri);
      } catch (err) {
        Alert.alert("Scanner Error", "Failed to capture the ingredients label photo.");
      }
    }
  };

  const triggerAnalysis = async (uri: string) => {
    setIsAnalyzing(true);
    try {
      // In a real device app, we pass the local URI. The service loads the file,
      // converts it to base64, and prompts Gemini 2.5 Flash.
      const result = await analyzeHalalIngredients(uri);
      setIsAnalyzing(false);
      
      // Navigate to separate native Results Screen
      navigation.navigate('Results', { result, imageUri: uri });
    } catch (err: any) {
      setIsAnalyzing(false);
      Alert.alert("Analysis Failed", err.message || "An error occurred during verification.");
    }
  };

  if (isCameraActive) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            {/* Dashed Target Finder Frame */}
            <View style={styles.scannerTarget} />
            
            <View style={styles.cameraFooter}>
              <TouchableOpacity 
                style={styles.captureBtn}
                onPress={handleCapture}
              >
                <CameraIcon size={24} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setIsCameraActive(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.bg}>
      <View style={styles.hero}>
        <View style={styles.badgeHub}>
          <Text style={styles.badgeHubText}>EXPO CAMERA INTERACTIVE</Text>
        </View>
        <Text style={styles.title}>HalalVerify Mobile</Text>
        <Text style={styles.subtitle}>
          Scan Japanese grocery list ingredients labels instantly using Google Gemini API.
        </Text>
      </View>

      <View style={styles.ctaGrid}>
        <TouchableOpacity 
          style={styles.ctaCardPrimary}
          onPress={() => setIsCameraActive(true)}
        >
          <View style={styles.iconCircleWhite}>
            <CameraIcon size={28} color="#10b981" />
          </View>
          <Text style={styles.ctaTitle}>Live Camera Scan</Text>
          <Text style={styles.ctaDesc}>
            Align Japanese kanji characters within camera frame to verify.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.ctaCardSecondary}
          onPress={handlePickImage}
        >
          <View style={styles.iconCircleGreen}>
            <Upload size={28} color="#ffffff" />
          </View>
          <Text style={styles.ctaTitleDark}>Choose from Photos</Text>
          <Text style={styles.ctaDescDark}>
            Pick an existing packaging card photograph from photo library.
          </Text>
        </TouchableOpacity>
      </View>

      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Running Gemini OCR Translation...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContainer: { padding: 24, alignItems: 'center' },
  hero: { alignItems: 'center', marginTop: 40, marginBottom: 30, textAlign: 'center' },
  badgeHub: { backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  badgeHubText: { fontSize: 10, fontWeight: '900', color: '#0369a1', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 8, paddingHorizontal: 16, lineHeight: 18 },
  ctaGrid: { width: '100%', gap: 16 },
  ctaCardPrimary: { backgroundColor: '#10b981', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 },
  iconCircleWhite: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ffffff', alignItems: 'center', justify: 'center', marginBottom: 16 },
  ctaTitle: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
  ctaDesc: { fontSize: 11, color: '#e6f4ea', textAlign: 'center', marginTop: 6, lineHeight: 15 },
  ctaCardSecondary: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  iconCircleGreen: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#10b981', alignItems: 'center', justify: 'center', marginBottom: 16 },
  ctaTitleDark: { fontSize: 16, fontWeight: '800', color: '#1f2937' },
  ctaDescDark: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 6, lineHeight: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraContainer: { flex: 1, backgroundColor: '#000000' },
  cameraOverlay: { flex: 1, justifyContent: 'space-between', padding: 24 },
  scannerTarget: { alignSelf: 'center', marginTop: '35%', width: 280, height: 280, borderWidth: 2, borderColor: '#10b981', borderStyle: 'dashed', borderRadius: 16 },
  cameraFooter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 20 },
  captureBtn: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#ffffff' },
  cancelBtn: { padding: 12 },
  cancelText: { color: '#ffffff', fontWeight: 'bold' },
  loadingOverlay: { marginTop: 20, padding: 16, backgroundColor: '#ffffff', borderRadius: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  loadingText: { marginTop: 10, fontSize: 12, fontWeight: '600', color: '#374151' }
});`
  },
  {
    path: "screens/ResultsScreen.tsx",
    name: "ResultsScreen.tsx",
    language: "typescript",
    content: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowLeft, Heart, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ResultsScreen({ route, navigation }) {
  const { result, imageUri } = route.params;
  const isHalal = ["H1", "H2", "H3"].includes(result.halalLevel);
  const isDoubtful = result.halalLevel === "D";

  return (
    <View style={styles.safe}>
      {/* Native Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#1f2937" />
          <Text style={styles.backText}>Scanner</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>AI Report</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Visual Header Image Card */}
        {imageUri && (
          <View style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.floatingTag}>
              <Text style={styles.floatingTagText}>{result.detectedLanguage || "Japanese"} Label</Text>
            </View>
          </View>
        )}

        {/* Dynamic Halal Level Status Box */}
        <View style={[
          styles.statusBox,
          isHalal ? styles.halalBox : isDoubtful ? styles.doubtfulBox : styles.haramBox
        ]}>
          <View style={styles.iconStamp}>
            {isHalal ? (
              <ShieldCheck size={28} color="#10b981" />
            ) : isDoubtful ? (
              <AlertTriangle size={28} color="#d97706" />
            ) : (
              <ShieldAlert size={28} color="#dc2626" />
            )}
          </View>

          <View style={styles.statusContent}>
            <Text style={[
              styles.statusCategory,
              isHalal ? styles.textHalal : isDoubtful ? styles.textDoubtful : styles.textHaram
            ]}>
              {result.halalLevel === "H1" && "HALAL CERTIFIED (H1)"}
              {result.halalLevel === "H2" && "HALAL INGREDIENTS (H2)"}
              {result.halalLevel === "H3" && "PERMITTED / SHARED LINE (H3)"}
              {result.halalLevel === "D" && "DOUBTFUL (D)"}
              {result.halalLevel === "HR1" && "CROSS WARNING (HR1)"}
              {result.halalLevel === "HR2" && "HARAM INGREDIENTS (HR2)"}
            </Text>
            <Text style={styles.productName}>{result.productName}</Text>
            {result.brand && <Text style={styles.brandName}>Brand: {result.brand}</Text>}
          </View>
        </View>

        {/* Ingredient Table breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Additives & Components List</Text>
          {result.ingredientsAnalysis && result.ingredientsAnalysis.map((item, idx) => {
            const itemType = item.category === "Haram" ? "haram" : (item.category === "Syubhat" ? "syubhat" : "halal");
            return (
              <View 
                key={idx} 
                style={[
                  styles.ingredientRow,
                  itemType === "haram" ? styles.rowHaram : (itemType === "syubhat" ? styles.rowDoubtful : styles.rowHalal)
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.ingredientName}>{item.name}</Text>
                    {item.extractedName && (
                      <Text style={styles.kanjiText}>{item.extractedName}</Text>
                    )}
                  </View>
                  <Text style={styles.ingredientReason}>{item.halalStatus}</Text>
                </View>
                <View style={[
                  styles.categoryPill,
                  itemType === "haram" ? styles.pillHaram : (itemType === "syubhat" ? styles.pillDoubtful : styles.pillHalal)
                ]}>
                  <Text style={[
                    styles.categoryPillText,
                    itemType === "haram" ? styles.pillTextHaram : (itemType === "syubhat" ? styles.pillTextDoubtful : styles.pillTextHalal)
                  ]}>
                    {item.category}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* AI Audit Rationale card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Verification Rationale</Text>
          <Text style={styles.rationaleText}>{result.halalLevelExplanation}</Text>
          
          <View style={styles.recBox}>
            <Sparkles size={16} color="#047857" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.recTitle}>Recommendation</Text>
              <Text style={styles.recDesc}>{result.finalRecommendation}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6', paddingTop: 44 },
  navBar: { height: 56, backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', px: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  navTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  scroll: { padding: 16, gap: 16 },
  imageCard: { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000000', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingTag: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  floatingTagText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  statusBox: { flexDirection: 'row', padding: 18, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 16 },
  halalBox: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
  doubtfulBox: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  haramBox: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  iconStamp: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  statusContent: { flex: 1 },
  statusCategory: { fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  textHalal: { color: '#047857' },
  textDoubtful: { color: '#b45309' },
  textHaram: { color: '#b91c1c' },
  productName: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 4 },
  brandName: { fontSize: 11, color: '#4b5563', fontWeight: '600', marginTop: 2 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 12 },
  ingredientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1 },
  rowHalal: { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' },
  rowDoubtful: { backgroundColor: '#fffbeb', borderColor: '#fef3c7' },
  rowHaram: { backgroundColor: '#fff5f5', borderColor: '#ffe4e4' },
  ingredientName: { fontSize: 14, fontWeight: '800', color: '#1f2937' },
  kanjiText: { fontSize: 12, fontWeight: '600', color: '#6b7280', backgroundColor: '#ffffff', paddingHorizontal: 4, borderRadius: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  ingredientReason: { fontSize: 11, color: '#4b5563', marginTop: 2, lineHeight: 14 },
  categoryPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillHalal: { backgroundColor: '#dcfce7' },
  pillDoubtful: { backgroundColor: '#fef3c7' },
  pillHaram: { backgroundColor: '#fee2e2' },
  categoryPillText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  pillTextHalal: { color: '#15803d' },
  pillTextDoubtful: { color: '#b45309' },
  pillTextHaram: { color: '#be123c' },
  rationaleText: { fontSize: 12, color: '#374151', lineHeight: 18, backgroundColor: '#f9fafb', padding: 12, borderRadius: 8 },
  recBox: { flexDirection: 'row', gap: 10, backgroundColor: '#eff6ff', padding: 12, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#dbeafe' },
  recTitle: { fontSize: 12, fontWeight: ' bold', color: '#1e40af' },
  recDesc: { fontSize: 11, color: '#1d4ed8', lineHeight: 15, marginTop: 2 }
});`
  },
  {
    path: "screens/BrandDirectoryScreen.tsx",
    name: "BrandDirectoryScreen.tsx",
    language: "typescript",
    content: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Search, Building } from 'lucide-react-native';

const DEMO_COMPANIES = [
  { id: "jha-1", companyName: "Kewpie Corporation", category: "Sauce", JHA_CertifiedProducts: ["Mayonnaise", "Deep Roasted Sesame Dressing"] },
  { id: "jha-2", companyName: "S&B Foods Inc.", category: "Curry", JHA_CertifiedProducts: ["Golden Curry Paste", "Wasabi Paste"] },
  { id: "jha-3", companyName: "Kikkoman Corporation", category: "Soy Sauce", JHA_CertifiedProducts: ["Halal Gluten Free Shoyu", "Regular Soy Sauce (Alcohol Free)"] }
];

export default function BrandDirectoryScreen() {
  const [search, setSearch] = useState('');
  const filtered = DEMO_COMPANIES.filter(c => 
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>JHA Database</Text>
      <Text style={styles.desc}>Verified Halal-certified Japanese brands & items:</Text>

      <View style={styles.searchBar}>
        <Search size={18} color="#9ca3af" />
        <TextInput 
          style={styles.input} 
          placeholder="Search brand or product category..." 
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList 
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.companyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleWithIcon}>
                <Building size={16} color="#10b981" />
                <Text style={styles.companyName}>{item.companyName}</Text>
              </View>
              <Text style={styles.categoryBadge}>{item.category}</Text>
            </View>
            <View style={styles.list}>
              {item.JHA_CertifiedProducts.map((p, idx) => (
                <Text key={idx} style={styles.productItem}>• {p}</Text>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  header: { fontSize: 20, fontWeight: '900', color: '#111827', marginTop: 24 },
  desc: { fontSize: 12, color: '#6b7280', marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderHeight: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 16 },
  input: { flex: 1, fontSize: 13, marginLeft: 8 },
  companyCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderHeight: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 10, marginBottom: 10 },
  titleWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  companyName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  categoryBadge: { fontSize: 9, fontWeight: '800', backgroundColor: '#f3f4f6', color: '#374151', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  list: { gap: 4 },
  productItem: { fontSize: 12, color: '#4b5563' }
});`
  },
  {
    path: "package.json",
    name: "package.json",
    language: "json",
    content: `{
  "name": "halal-verify-native",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.9.26",
    "expo": "~51.0.0",
    "expo-camera": "~15.0.13",
    "expo-image-picker": "~15.0.5",
    "expo-status-bar": "~1.12.1",
    "lucide-react-native": "^0.379.0",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "~3.31.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  },
  "private": true
}`
  }
];
