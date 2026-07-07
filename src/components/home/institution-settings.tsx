"use client";

import Image from "next/image";
import { Building2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { fileToDataUrl } from "@/lib/utils";

export function InstitutionSettings() {
  const { institutionName, institutionLogo, setInstitutionName, setInstitutionLogo } =
    useAppContext();

  const handleLogoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setInstitutionLogo(dataUrl);
    } catch {
      // ignore
    }
    event.target.value = "";
  };

  return (
    <Card className="border-orange-100/80 bg-white/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4 text-orange-500" />
          机构信息（选填）
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">机构名称</label>
          <Input
            value={institutionName}
            onChange={(event) => setInstitutionName(event.target.value)}
            placeholder="如：阳光午托中心"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">机构 Logo</label>
          <div className="flex items-center gap-3">
            {institutionLogo ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border bg-white">
                <Image
                  src={institutionLogo}
                  alt="机构 Logo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed bg-muted/50 text-xs text-muted-foreground">
                无
              </div>
            )}
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <span className="inline-flex h-9 items-center rounded-lg border px-3 text-xs hover:bg-accent">
                  上传 Logo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoSelect}
                />
              </label>
              {institutionLogo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setInstitutionLogo(null)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          不填写时，分享卡片底部不会显示机构信息
        </p>
      </CardContent>
    </Card>
  );
}
