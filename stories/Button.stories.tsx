import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Bell, Check, ChevronRight, Download, ExternalLink, Mail, Plus, Search, Send, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default','outline','ghost','accent','success','success-outline','destructive','destructive-outline','warning','secondary','dark','link'],
      description: 'Variacao visual do botao',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['xs','sm','default','lg','xl','icon','icon-xs','icon-sm','icon-lg'],
      description: 'Tamanho do botao',
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'Botao', variant: 'default', size: 'default', loading: false, disabled: false, fullWidth: false },
}

export default meta
type Story = StoryObj<typeof Button>

export const Playground: Story = { name: 'Playground', args: { children: 'Botao GOV.BR' } }

export const Variants: Story = {
  name: 'Todas as variantes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className='flex flex-col gap-6 p-6 bg-white rounded-xl min-w-[600px]'>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3'>Acoes primarias</p>
        <div className='flex flex-wrap gap-3'>
          <Button variant='default'>Primario</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
        </div>
      </div>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3'>Feedback e status</p>
        <div className='flex flex-wrap gap-3'>
          <Button variant='success'>Sucesso</Button>
          <Button variant='success-outline'>Sucesso outline</Button>
          <Button variant='warning'>Aviso</Button>
          <Button variant='destructive'>Destrutivo</Button>
          <Button variant='destructive-outline'>Destrutivo outline</Button>
        </div>
      </div>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3'>Especiais</p>
        <div className='flex flex-wrap gap-3'>
          <Button variant='accent'>Destaque amarelo</Button>
          <Button variant='secondary'>Secundario cinza</Button>
          <Button variant='dark'>Institucional escuro</Button>
        </div>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Tamanhos',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className='flex items-end gap-3 p-6 bg-white rounded-xl'>
      <Button size='xs'>Extra pequeno</Button>
      <Button size='sm'>Pequeno</Button>
      <Button size='default'>Padrao</Button>
      <Button size='lg'>Grande</Button>
      <Button size='xl'>Extra grande</Button>
    </div>
  ),
}
export const WithIcons: Story = {
  name: 'Com icones',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className='flex flex-col gap-4 p-6 bg-white rounded-xl min-w-[500px]'>
      <div className='flex flex-wrap gap-3'>
        <Button><Plus /> Nova manifestacao</Button>
        <Button variant='outline'><Search /> Consultar</Button>
        <Button variant='success'><Check /> Confirmar</Button>
        <Button variant='destructive'><Trash2 /> Excluir</Button>
        <Button variant='secondary'><Download /> Exportar</Button>
        <Button variant='ghost'><Upload /> Enviar</Button>
      </div>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3'>Icone a direita</p>
        <div className='flex flex-wrap gap-3'>
          <Button>Continuar <ChevronRight /></Button>
          <Button variant='outline'>Ver detalhes <ExternalLink /></Button>
          <Button variant='ghost'>Enviar email <Send /></Button>
        </div>
      </div>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3'>Somente icone</p>
        <div className='flex items-center gap-3'>
          <Button size='icon-xs' variant='ghost' aria-label='Notificacoes'><Bell /></Button>
          <Button size='icon-sm' variant='outline' aria-label='Buscar'><Search /></Button>
          <Button size='icon' aria-label='Adicionar'><Plus /></Button>
          <Button size='icon-lg' variant='success' aria-label='Confirmar'><Check /></Button>
        </div>
      </div>
    </div>
  ),
}

export const States: Story = {
  name: 'Estados',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className='flex flex-col gap-4 p-6 bg-white rounded-xl min-w-[500px]'>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3'>Normal, Desabilitado, Carregando</p>
        <div className='flex flex-wrap gap-3'>
          <Button>Normal</Button>
          <Button disabled>Desabilitado</Button>
          <Button loading>Carregando</Button>
        </div>
      </div>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3'>Loading em outras variantes</p>
        <div className='flex flex-wrap gap-3'>
          <Button variant='outline' loading>Enviando...</Button>
          <Button variant='success' loading>Salvando...</Button>
          <Button variant='destructive' loading>Excluindo...</Button>
        </div>
      </div>
    </div>
  ),
}

export const FullWidth: Story = {
  name: 'Largura total',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className='flex flex-col gap-3 p-6 bg-white rounded-xl w-[400px]'>
      <Button fullWidth>Enviar manifestacao</Button>
      <Button fullWidth variant='outline'>Cancelar</Button>
      <Button fullWidth variant='success' loading>Processando...</Button>
    </div>
  ),
}

export const GovBR: Story = {
  name: 'Padrao GOV.BR',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className='flex flex-col gap-6 p-8 bg-white rounded-xl min-w-[500px]'>
      <div>
        <p className='text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4'>Hierarquia de acoes</p>
        <div className='flex flex-col gap-3 max-w-xs'>
          <Button fullWidth size='lg'>Entrar com GOV.BR</Button>
          <Button fullWidth variant='outline'>Criar conta</Button>
          <Button fullWidth variant='ghost'>Esqueci minha senha</Button>
        </div>
      </div>
      <div className='p-6 bg-[#071D41] rounded-lg'>
        <p className='text-xs font-semibold text-white/60 uppercase tracking-wider mb-4'>No fundo escuro</p>
        <div className='flex gap-3'>
          <Button variant='accent'><Mail /> Contato</Button>
          <Button variant='ghost' className='text-white hover:bg-white/10'>Saiba mais</Button>
        </div>
      </div>
    </div>
  ),
}

export const Primary: Story = { name: 'Primario', args: { children: 'Primario', variant: 'default' } }
export const Outline: Story = { name: 'Outline', args: { children: 'Outline', variant: 'outline' } }
export const Ghost: Story = { name: 'Ghost', args: { children: 'Ghost', variant: 'ghost' } }
export const Accent: Story = { name: 'Destaque amarelo', args: { children: 'Destaque', variant: 'accent' } }
export const Success: Story = { name: 'Sucesso', args: { children: 'Confirmar', variant: 'success' } }
export const Destructive: Story = { name: 'Destrutivo', args: { children: 'Excluir', variant: 'destructive' } }
export const Warning: Story = { name: 'Aviso', args: { children: 'Atencao', variant: 'warning' } }
export const Loading: Story = { name: 'Carregando', args: { children: 'Enviando...', loading: true } }