<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

final class SiteConfig
{
    public const KEY_TITLE = 'site.title';

    public const KEY_CONTACT = 'site.contact_person';

    public const KEY_LOGO = 'site.logo';

    public const KEY_FAVICON = 'site.favicon';

    public const KEY_FOOTER_COPYRIGHT = 'site.footer_copyright';

    public const KEY_FOOTER_CREDIT = 'site.footer_credit';

    public const KEY_SOCIAL = 'site.social_json';

    public const KEY_TIMEZONE = 'site.timezone';

    /**
     * @return array{
     *   title: string,
     *   contact_person: string,
     *   logo_url: ?string,
     *   favicon_url: ?string,
     *   footer_copyright: string,
     *   footer_credit: string,
     *   social: array{
     *     facebook: string,
     *     twitter: string,
     *     linkedin: string,
     *     instagram: string,
     *     youtube: string,
     *     github: string
     *   },
     *   timezone: string
     * }
     */
    public static function toSharedArray(): array
    {
        return [
            'title' => (string) (Setting::get(self::KEY_TITLE, config('app.name')) ?? config('app.name')),
            'contact_person' => (string) (Setting::get(self::KEY_CONTACT, '') ?? ''),
            'logo_url' => self::logoUrl(),
            'favicon_url' => self::faviconUrl(),
            'footer_copyright' => (string) (Setting::get(self::KEY_FOOTER_COPYRIGHT, '') ?? ''),
            'footer_credit' => (string) (Setting::get(self::KEY_FOOTER_CREDIT, '') ?? ''),
            'social' => self::socialLinks(),
            'timezone' => (string) (Setting::get(self::KEY_TIMEZONE, config('app.timezone')) ?? config('app.timezone')),
        ];
    }

    /**
     * @return array{
     *     facebook: string,
     *     twitter: string,
     *     linkedin: string,
     *     instagram: string,
     *     youtube: string,
     *     github: string
     * }
     */
    public static function socialLinks(): array
    {
        $defaults = [
            'facebook' => '',
            'twitter' => '',
            'linkedin' => '',
            'instagram' => '',
            'youtube' => '',
            'github' => '',
        ];
        $raw = Setting::get(self::KEY_SOCIAL);
        if ($raw === null || $raw === '') {
            return $defaults;
        }
        $decoded = json_decode($raw, true);
        if (! is_array($decoded)) {
            return $defaults;
        }

        return array_merge($defaults, array_intersect_key($decoded, $defaults));
    }

    public static function logoUrl(): ?string
    {
        $path = Setting::get(self::KEY_LOGO);

        return $path ? Storage::disk('public')->url($path) : null;
    }

    public static function faviconUrl(): ?string
    {
        $path = Setting::get(self::KEY_FAVICON);

        return $path ? Storage::disk('public')->url($path) : null;
    }
}
