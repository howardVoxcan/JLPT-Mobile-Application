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

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 24;

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ========================
   * LOAD USER PROFILE
   * ======================== */
  useEffect(() => {
    const loadMe = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch (error) {
        console.error("Get profile failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMe();
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
   * NOTEBOOK MOCK (giữ nguyên)
   * ======================== */
  const notebooks = [
    [
      { title: "Từ vựng", level: "N3" },
      { title: "Kanji", level: "N4" },
      { title: "Ngữ pháp", level: "N3" },
    ],
    [
      { title: "Đọc hiểu", level: "N5" },
      { title: "Nghe hiểu", level: "N5" },
      { title: "Thi JLPT", level: "N5" },
    ],
  ];

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
            <Ionicons name="chevron-forward" size={28} />
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
            <Ionicons name="chevron-forward" size={28} />
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
          <View style={styles.notebookHeader}>
            <MaterialCommunityIcons
              name="notebook-outline"
              size={32}
              color={Colors.secondaryHover}
            />
            <Text style={styles.menuText}>Sổ tay học tập</Text>
          </View>

          {notebooks.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.notebookRow}>
              {row.map((item, index) => (
                <View key={index} style={styles.notebookCard}>
                  <View style={styles.notebookTop}>
                    <Text style={styles.notebookText}>{item.title}</Text>
                  </View>
                  <View style={styles.notebookBottom}>
                    <Text style={styles.notebookText}>{item.level}</Text>
                  </View>
                </View>
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