<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__)
    ->exclude('config');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
    ])
    ->setFinder($finder);