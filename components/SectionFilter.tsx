'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { cn } from '../lib/utils'
import { Button } from './Button'
import * as Tabs from '@radix-ui/react-tabs'

interface SectionFilterProps {
  sections: Array<{ id: string; name: { fr: string; en: string } }>
  activeSection: string
  onSectionChange: (section: string) => void
}

export const SectionFilter: React.FC<SectionFilterProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  const { i18n } = useTranslation()

  return (
    <Tabs.Root value={activeSection} onValueChange={onSectionChange}>
      <Tabs.List className="flex flex-wrap justify-center gap-2 mb-12">
        <Tabs.Trigger value="all" asChild>
          <Button
            variant={activeSection === 'all' ? 'primary' : 'ghost'}
            size="sm"
            className="lowercase"
          >
            all
          </Button>
        </Tabs.Trigger>
        
        {sections.map((section) => (
          <Tabs.Trigger key={section.id} value={section.id} asChild>
            <Button
              variant={activeSection === section.id ? 'primary' : 'ghost'}
              size="sm"
              className="lowercase"
            >
              {section.name[i18n.language as 'fr' | 'en']}
            </Button>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}