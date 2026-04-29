<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\SiteConfig;
use DateTimeZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    public function edit(): Response
    {
        $social = SiteConfig::socialLinks();

        return Inertia::render('Admin/SiteSettings/Index', [
            'settings' => [
                'site_title' => Setting::get(SiteConfig::KEY_TITLE, config('app.name')) ?? config('app.name'),
                'contact_person' => Setting::get(SiteConfig::KEY_CONTACT, '') ?? '',
                'logo_url' => SiteConfig::logoUrl(),
                'favicon_url' => SiteConfig::faviconUrl(),
                'footer_copyright' => Setting::get(SiteConfig::KEY_FOOTER_COPYRIGHT, '') ?? '',
                'footer_credit' => Setting::get(SiteConfig::KEY_FOOTER_CREDIT, '') ?? '',
                'timezone' => Setting::get(SiteConfig::KEY_TIMEZONE, config('app.timezone')) ?? config('app.timezone'),
                'social_facebook' => $social['facebook'],
                'social_twitter' => $social['twitter'],
                'social_linkedin' => $social['linkedin'],
                'social_instagram' => $social['instagram'],
                'social_youtube' => $social['youtube'],
                'social_github' => $social['github'],
            ],
            'timezones' => DateTimeZone::listIdentifiers(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'site_title' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'footer_copyright' => 'nullable|string|max:2000',
            'footer_credit' => 'nullable|string|max:500',
            'timezone' => ['required', 'timezone:all'],
            'logo' => 'nullable|image|max:4096',
            'favicon' => 'nullable|file|max:1024|mimes:ico,png,svg,webp,jpg,jpeg',
            'remove_logo' => 'sometimes|boolean',
            'remove_favicon' => 'sometimes|boolean',
            'social_facebook' => 'nullable|string|max:500',
            'social_twitter' => 'nullable|string|max:500',
            'social_linkedin' => 'nullable|string|max:500',
            'social_instagram' => 'nullable|string|max:500',
            'social_youtube' => 'nullable|string|max:500',
            'social_github' => 'nullable|string|max:500',
        ]);

        foreach (['social_facebook', 'social_twitter', 'social_linkedin', 'social_instagram', 'social_youtube', 'social_github'] as $field) {
            $v = trim((string) ($request->input($field) ?? ''));
            if ($v !== '' && ! filter_var($v, FILTER_VALIDATE_URL)) {
                return redirect()->back()->withErrors([$field => 'Must be a valid URL.'])->withInput();
            }
        }

        Setting::set(SiteConfig::KEY_TITLE, $request->string('site_title')->toString());
        Setting::set(SiteConfig::KEY_CONTACT, $request->input('contact_person') ? $request->string('contact_person')->toString() : '');
        Setting::set(SiteConfig::KEY_FOOTER_COPYRIGHT, $request->input('footer_copyright') ? $request->string('footer_copyright')->toString() : '');
        Setting::set(SiteConfig::KEY_FOOTER_CREDIT, $request->input('footer_credit') ? $request->string('footer_credit')->toString() : '');
        Setting::set(SiteConfig::KEY_TIMEZONE, $request->string('timezone')->toString());

        $social = [
            'facebook' => (string) ($request->input('social_facebook') ?? ''),
            'twitter' => (string) ($request->input('social_twitter') ?? ''),
            'linkedin' => (string) ($request->input('social_linkedin') ?? ''),
            'instagram' => (string) ($request->input('social_instagram') ?? ''),
            'youtube' => (string) ($request->input('social_youtube') ?? ''),
            'github' => (string) ($request->input('social_github') ?? ''),
        ];
        $social = array_map('trim', $social);
        if (array_filter($social)) {
            Setting::set(SiteConfig::KEY_SOCIAL, json_encode($social));
        } else {
            Setting::set(SiteConfig::KEY_SOCIAL, null);
        }

        if ($request->hasFile('logo')) {
            $this->deleteStored(SiteConfig::KEY_LOGO);
            $path = $request->file('logo')->store('site-branding', 'public');
            Setting::set(SiteConfig::KEY_LOGO, $path);
        } elseif ($request->boolean('remove_logo')) {
            $this->deleteStored(SiteConfig::KEY_LOGO);
            Setting::set(SiteConfig::KEY_LOGO, null);
        }

        if ($request->hasFile('favicon')) {
            $this->deleteStored(SiteConfig::KEY_FAVICON);
            $path = $request->file('favicon')->store('site-branding', 'public');
            Setting::set(SiteConfig::KEY_FAVICON, $path);
        } elseif ($request->boolean('remove_favicon')) {
            $this->deleteStored(SiteConfig::KEY_FAVICON);
            Setting::set(SiteConfig::KEY_FAVICON, null);
        }

        return redirect()->back()->with('success', 'Site settings saved.');
    }

    private function deleteStored(string $key): void
    {
        $path = Setting::get($key);
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
