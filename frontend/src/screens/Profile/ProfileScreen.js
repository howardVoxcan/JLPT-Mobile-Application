import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

import { getMe, logout } from "../../services/authService";
import { getNotebookCategories } from "../../services/notebookService";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 24;

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notebooks, setNotebooks] = useState([]);

  /* ========================
   * LOAD USER PROFILE & NOTEBOOKS
   * ======================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, notebookData] = await Promise.all([
          getMe(),
          getNotebookCategories()
        ]);
        setUser(userData);
        
        // Transform API data to notebook format
        // Group into rows of 3
        const transformed = notebookData.map(cat => {
          // Find the highest level with progress
          let highestLevel = 'N5';
          if (cat.completed_levels > 0) {
            const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
            highestLevel = levels[Math.min(cat.completed_levels - 1, 4)];
          } else if (cat.in_progress_levels > 0) {
            const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
            highestLevel = levels[Math.min(cat.in_progress_levels - 1, 4)];
          }
          
          return {
            title: cat.category,
            level: highestLevel
          };
        });
        
        // Group into rows of 3
        const rows = [];
        for (let i = 0; i < transformed.length; i += 3) {
          rows.push(transformed.slice(i, i + 3));
        }
        setNotebooks(rows);
      } catch (error) {
        console.error("Get profile/notebooks failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ========================
   * HANDLERS
   * ======================== */
  const handleNavigateToSection = (section) => {
    if (section === "favorites") {
      navigation.navigate("Favorites");
    } else if (section === "settings") {
      navigation.navigate("Settings");
    } else if (section === "switch-user") {
      // future: switch account
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };


  /* ========================
   * LOADING UI
   * ======================== */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= USER INFO ================= */}
        <View style={styles.section}>
          <View style={styles.userInfo}>
            {/* Avatar */}
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={64}
                color="#000"
              />
            )}

            {/* User detail */}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.full_name || "Chưa đặt tên"}
              </Text>
              <Text style={styles.userSubtext}>
                {user?.email}
              </Text>
            </View>

            {/* Switch user
            <TouchableOpacity
              style={styles.switchUserButton}
              onPress={() => handleNavigateToSection("switch-user")}
            >
              <MaterialCommunityIcons
                name="account-switch"
                size={18}
                color={Colors.secondaryHover}
              />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* ================= MENU ================= */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigateToSection("favorites")}
          >
            <MaterialCommunityIcons
              name="heart-outline"
              size={32}
              color={Colors.secondaryHover}
            />
            <Text style={styles.menuText}>Lưu trữ yêu thích</Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={Colors.textSecondary}
              style={styles.chevronIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigateToSection("settings")}
          >
            <Ionicons
              name="settings-outline"
              size={32}
              color={Colors.secondaryHover}
            />
            <Text style={styles.menuText}>Cài đặt chung</Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={Colors.textSecondary}
              style={styles.chevronIcon}
            />
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity
            style={[styles.menuItem, { borderTopWidth: 1 }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={32} color="red" />
            <Text style={[styles.menuText, { color: "red" }]}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= NOTEBOOK ================= */}
        <View style={styles.notebookSection}>
          <TouchableOpacity
            style={styles.notebookHeader}
            onPress={() => navigation.navigate("Notebook")}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="notebook-outline"
              size={32}
              color={Colors.secondaryHover}
            />
            <Text style={styles.menuText}>Sổ tay học tập</Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={Colors.textSecondary}
              style={styles.chevronIcon}
            />
          </TouchableOpacity>

          {notebooks.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.notebookRow}>
              {row.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.notebookCard}
                  onPress={() => navigation.navigate("NotebookDetail", { notebookType: item.title })}
                  activeOpacity={0.7}
                >
                  <View style={styles.notebookTop}>
                    <Text style={styles.notebookText}>{item.title}</Text>
                  </View>
                  <View style={styles.notebookBottom}>
                    <Text style={styles.notebookText}>{item.level}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(225, 225, 225, 0.5)',
    marginTop: 7,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    paddingHorizontal: 26,
  },
  avatar: {
    width: 64,
    height: 64,
  },
  userDetails: {
    marginLeft: 7,
    flex: 1,
  },
  userName: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 23,
    color: Colors.textPrimary,
  },
  userSubtext: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  switchUserButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 42,
  },
  menuText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 23,
    color: Colors.textPrimary,
    marginLeft: 23,
    flex: 1,
  },
  chevronIcon: {
    marginRight: 29,
  },
  notebookSection: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(225, 225, 225, 0.5)',
    marginTop: 7,
    paddingBottom: 16,
  },
  notebookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 42,
  },
  notebookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 46,
    marginBottom: 11,
  },
  notebookCard: {
    width: 86,
    height: 40,
  },
  notebookTop: {
    height: 20,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.formStrokeDefault,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notebookBottom: {
    height: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.formStrokeDefault,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notebookText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
    textAlign: 'center',
  },
  notebookTitle: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
    textAlign: 'center',
  },
  notebookLevel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});