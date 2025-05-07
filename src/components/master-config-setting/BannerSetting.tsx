import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/utils'
import { TServerFile } from '@/types/file'
import { IMasterConfig } from '@/types/master-config'

interface BannerSettingsProps {
  data: IMasterConfig
  isEditing: boolean
  onChange: (bannerId: string, values: unknown) => void
  onAddBanner: (banner: unknown) => void
  onRemoveBanner: (bannerId: string) => void
}

export default function BannerSettings({
  data,
  isEditing,
  onChange,
  onAddBanner,
  onRemoveBanner
}: BannerSettingsProps) {
  const [newBannerUrl, setNewBannerUrl] = useState('')
  const [newBannerName, setNewBannerName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddBanner = () => {
    if (!newBannerUrl) return

    const newBanner = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: newBannerName || null,
      fileUrl: newBannerUrl,
      status: 'ACTIVE'
    }

    onAddBanner(newBanner)
    setNewBannerUrl('')
    setNewBannerName('')
    setDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Banner Management</CardTitle>
          <CardDescription>Manage promotional banners displayed on the platform</CardDescription>
        </div>
        {isEditing && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm'>
                <Plus className='mr-2 h-4 w-4' />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
                <DialogDescription>Add a new promotional banner to display on the platform.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='bannerUrl'>Banner Image URL</Label>
                  <Input
                    id='bannerUrl'
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    placeholder='https://example.com/banner.jpg'
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBanner} disabled={!newBannerUrl}>
                  Add Banner
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-6'>
          {data.banners &&
            data.banners.map((banner: TServerFile) => (
              <div key={banner.id} className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg'>
                <div className='w-full md:w-1/3 h-40 relative rounded-md overflow-hidden'>
                  <img
                    src={banner.fileUrl || '/placeholder.svg'}
                    alt={banner.name || 'Banner'}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='flex-1 space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor={`banner-url-${banner.id}`}>Image URL</Label>
                    <Input
                      id={`banner-url-${banner.id}`}
                      value={banner.fileUrl}
                      onChange={(e) => onChange(banner.id, { fileUrl: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        id={`banner-status-${banner.id}`}
                        checked={banner.status === 'ACTIVE'}
                        onCheckedChange={(checked) => onChange(banner.id, { status: checked ? 'ACTIVE' : 'INACTIVE' })}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={`banner-status-${banner.id}`}>
                        {banner.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Label>
                    </div>

                    <div className='text-sm text-muted-foreground'>Created: {formatDate(banner.createdAt)}</div>

                    {isEditing && (
                      <Button variant='destructive' size='sm' onClick={() => onRemoveBanner(banner.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {(!data.banners || data.banners.length === 0) && (
            <div className='text-center py-8 text-muted-foreground'>
              No banners found. Add a banner to display promotional content.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
