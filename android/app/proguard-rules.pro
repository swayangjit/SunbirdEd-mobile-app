
-dontwarn java.awt.**,javax.swing.**
-dontwarn org.mozilla.javascript.tools.**
-dontwarn net.minidev.json.JSONArray
-dontwarn net.minidev.json.JSONAware
-dontwarn net.minidev.json.JSONObject
-dontwarn net.minidev.json.parser.JSONParser
-dontwarn net.minidev.json.parser.ParseException
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
#Keep ADAL classes
-keep class com.microsoft.aad.adal.** { *; }
-keep class com.microsoft.identity.common.** { *; }
#Keep Gson for ADAL https://github.com/google/gson/blob/master/examples/android-proguard-example/proguard.cfg
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.examples.android.model.** { *; }
-keep class * implements com.google.gson.** {*;}
-dontwarn org.bouncycastle.**
-keepnames class com.fasterxml.jackson.databind.** { *; }
-dontwarn com.fasterxml.jackson.databind.*
-keepattributes InnerClasses
-keep class org.bouncycastle.** { *; }
-keepnames class org.bouncycastle.* { *; }
-dontwarn org.bouncycastle.*
-keep class io.jsonwebtoken.** { *; }
-keepnames class io.jsonwebtoken.* { *; }
-keepnames interface io.jsonwebtoken.* { *; }
-dontwarn javax.xml.bind.DatatypeConverter
-dontwarn io.jsonwebtoken.impl.Base64Codec
-keepnames class com.fasterxml.jackson.** { * ; }
-keepnames interface com.fasterxml.jackson.** { *; }
-keep class org.sunbird.app.BuildConfig { *;}
-keep class android.webkit.WebViewFactory { *; }
-dontnote android.net.http.*
-dontnote org.apache.commons.codec.**
-dontnote org.apache.http.**
-keep class com.google.android.gms.** { *; }
-keep,includedescriptorclasses class com.journeyapps.barcodescanner.** { *; }
-keepclassmembers class com.journeyapps.barcodescanner.** { *; }
-keep,includedescriptorclasses class androidx.mediaandroid.webkit.WebViewFactory.** { *; }
-keepclassmembers class androidx.media.** { *; }
-keep class androidx.versionedparcelable.VersionedParcel
-dontnote android.webkit.WebViewFactory
-dontnote me.leolin.shortcutbadger.impl.AsusHomeLauncher
-dontnote me.leolin.shortcutbadger.impl.SolidHomeBadger
-dontnote com.android.org.conscrypt.SSLParametersImpl
-dontnote org.apache.harmony.xnet.provider.jsse.SSLParametersImpl
-dontnote org.conscrypt.ConscryptEngineSocket
-dontnote sun.security.ssl.SSLContextImpl
-dontnote org.crosswalk.engine.XWalkWebViewEngine
-dontnote com.google.firebase.crash.FirebaseCrash
-dontnote me.leolin.shortcutbadger.impl.XiaomiHomeBadger
-dontnote okhttp3.internal.platform.AndroidPlatform$CloseGuard
-dontnote com.google.android.gms.internal.measurement.**

-keepclassmembers class com.google.android.gms.** { *; }
-dontnote android.os.**
-dontnote com.google.android.gms.ads.AdView
-dontnote com.google.android.gms.common.api.internal.BasePendingResult$ReleasableResultGuardian
-dontnote com.google.android.gms.tagmanager.TagManagerService
-dontnote com.google.android.gms.common.api.internal.BasePendingResult
-dontnote com.google.android.gms.gcm.GcmListenerService

-keep class com.google.android.gms.** { *; }
-keep public class com.google.android.gms.* { public *; }
-dontwarn com.google.android.gms.**
-keep class io.liteglue.SQLiteNativeResponse { *; }